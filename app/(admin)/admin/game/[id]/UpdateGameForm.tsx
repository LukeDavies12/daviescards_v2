'use client'

import { Player } from "@prisma/client"
import { Trash2Icon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { GameWithPlayerScores } from "../../AdminToggle"
import { updateGame } from "../../adminActions"

export default function UpdateGameForm({ game, players }: { game: GameWithPlayerScores, players: Player[] }) {
  const [playerScores, setPlayerScores] = useState(
    game.player_scores?.map((score) => ({ player_id: score.player_id, score: score.score })) || [{ player_id: "", score: 0 }]
  )
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      dateInputRef.current?.focus()
      setInitialized(true)
    }
  }, [initialized])

  const addPlayer = () => {
    setPlayerScores((prev) => [...prev, { player_id: "", score: 0 }])
  }

  const removePlayer = (index: number) => {
    setPlayerScores((prev) => prev.filter((_, i) => i !== index))
  }

  const updateGameWithId = updateGame.bind(null, game.id)

  return (
    <div className="xl:w-1/2 md:w-3/4 p-6 xl:mx-auto border border-neutral-100 rounded-xl">
      <h1>Update Game</h1>
      <form className="flex flex-col gap-4 mt-4" action={updateGameWithId}>
        <div>
          <label htmlFor="date" className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            defaultValue={new Date(game.date).toISOString().split("T")[0]}
            required
            ref={dateInputRef}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="location" className="block font-medium mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={game.location || ""}
            placeholder="Cocoa Beach, FL"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="message" className="block font-medium mb-1">Message</label>
          <textarea
            id="message"
            className="w-full p-2 border rounded"
            name="message"
            rows={3}
            defaultValue={game.message || ""}
          />
        </div>
        <div>
          <p className="font-medium mb-2 cursor-default">Player Scores</p>
          <div className="flex flex-col gap-1">
            {playerScores.map((playerScore, i) => (
              <div key={i} className="flex gap-2">
                <select
                  className="w-1/2 p-2 border rounded"
                  name={`player-${i}`}
                  id={`player-${i}`}
                  value={playerScore.player_id}
                  onChange={(e) =>
                    setPlayerScores((prev) =>
                      prev.map((ps, idx) => idx === i ? { ...ps, player_id: e.target.value } : ps)
                    )
                  }
                >
                  <option value="">Select Player</option>
                  {players.map(player => (
                    <option key={player.id} value={player.id}>{player.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name={`score-${i}`}
                  id={`score-${i}`}
                  className="w-1/2 p-2 border rounded"
                  value={playerScore.score}
                  onChange={(e) =>
                    setPlayerScores((prev) =>
                      prev.map((ps, idx) => idx === i ? { ...ps, score: +e.target.value } : ps)
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => removePlayer(i)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <Trash2Icon className="w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addPlayer}
            className="bg-slate-600 mt-4 text-white hover:bg-slate-500 active:text-slate-300
                transition-colors duration-100 ease-linear rounded-md px-4 py-1 cursor-pointer inline-block">
            Add Player
          </button>
        </div>
        <button type="submit" className="primary">
          Update
        </button>
      </form>
    </div>
  )
}
