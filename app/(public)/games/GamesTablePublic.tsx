'use client'

import React, { useState } from "react";
import { GameWithPlayerScores } from "@/app/(admin)/admin/AdminToggle";

export default function GamesTablePublic({ initialGames }: { initialGames: GameWithPlayerScores[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const sortedGames = initialGames.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const paginatedGames = sortedGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="w-full">
      <h1>Game Log</h1>
      <div className="md:hidden mt-4">
        {paginatedGames.map((game: GameWithPlayerScores) => (
          <div key={game.id} className="border-b border-neutral-100 p-4">
            <p>
              {new Date(game.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              })} at {game.location} with {game.player_scores.length} players
            </p>
            <p className="border-l-2 border-slate-800 pl-2 mt-2">
              {game.message}
            </p>
            <button
              onClick={() => toggleRow(game.id)}
              className="text-neutral-500 hover:underline mt-3"
            >
              {expandedRow === game.id ? "Hide Details" : "View Details"}
            </button>
            {expandedRow === game.id && (
              <div className="text-sm border-gray-100 border rounded-lg p-4 mt-3">
                <table className="mt-1 w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">#</th>
                      <th className="text-left">Player</th>
                      <th className="text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {game.player_scores
                      .slice()
                      .sort((a, b) => b.score - a.score)
                      .map((playerScore, index) => (
                        <tr key={playerScore.player.id}>
                          <td>{index + 1}</td>
                          <td>{playerScore.player.name}</td>
                          <td className="text-right">{playerScore.score}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
      <table className="hidden md:table table-auto w-full border-collapse text-left text-sm mt-4">
        <thead>
          <tr>
            <th className="font-medium text-gray-700">Date</th>
            <th className="font-medium text-gray-700">Location</th>
            <th className="font-medium text-gray-700">Message</th>
            <th className="font-medium text-gray-700"># of Players</th>
            <th className="font-medium text-gray-700">Players</th>
          </tr>
        </thead>
        <tbody>
          {paginatedGames.map((game: GameWithPlayerScores) => (
            <React.Fragment key={game.id}>
              <tr>
                <td className="py-1">
                  {new Date(game.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </td>
                <td className="py-1">{game.location}</td>
                <td
                  className="py-1 truncate"
                  title={game.message || ""}
                >
                  {game.message && game.message.length > 30
                    ? `${game.message.substring(0, 30)}...`
                    : game.message}
                </td>
                <td className="py-1">{game.player_scores.length}</td>
                <td className="py-1">
                  {game.player_scores
                    .slice()
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 2)
                    .map((player) => player.player.name)
                    .join(", ")}
                  {game.player_scores.length > 2 && ", ..."}
                </td>
                <td className="py-1">
                  <button
                    onClick={() => toggleRow(game.id)}
                    className="text-neutral-500 hover:underline"
                  >
                    {expandedRow === game.id ? "Hide Details" : "View Details"}
                  </button>
                </td>
              </tr>
              {expandedRow === game.id && (
                <tr>
                  <td colSpan={6}>
                    <div className="text-sm border-gray-100 border rounded-lg p-4">
                      <p className="border-l-2 border-slate-800 pl-2">
                        {game.message}
                      </p>
                      <div className="mt-8">
                        <table className="mt-1 w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left">#</th>
                              <th className="text-left">Player</th>
                              <th className="text-right">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {game.player_scores
                              .slice()
                              .sort((a, b) => b.score - a.score)
                              .map((playerScore, index) => (
                                <tr key={playerScore.player.id}>
                                  <td>{index + 1}</td>
                                  <td>{playerScore.player.name}</td>
                                  <td className="text-right">{playerScore.score}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({
          length: Math.ceil(sortedGames.length / itemsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${currentPage === index + 1
              ? "bg-slate-800 text-white"
              : "bg-gray-200 text-gray-800"
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};