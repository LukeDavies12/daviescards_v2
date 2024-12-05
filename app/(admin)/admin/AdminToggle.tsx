"use client";

import { Player, Prisma } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type GameWithPlayerScores = Prisma.GameGetPayload<{
  include: {
    player_scores: {
      include: {
        player: true;
      };
    };
  };
}>;

export default function AdminToggle({
  initialPlayers,
  initialGames
}: {
  initialPlayers: Player[],
  initialGames: GameWithPlayerScores[]
}) {
  const [showContent, setShowContent] = useState<"games" | "players">("games");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDelete = (player: Player) => {
    confirm(`Are you sure you want to delete ${player.name}?`);
    // Implement delete logic here
    console.log(`Deleting player: ${player.name}`);
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (setOpenMenuId && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <>
      <h1>Admin</h1>
      <div className="p-1 bg-neutral-100 rounded-xl inline-flex my-1">
        <div>
          <button
            className={`px-3 py-1 hover:text-neutral-800 active:text-black ${showContent === "games" ? "bg-white rounded-lg" : ""}`}
            onClick={() => setShowContent("games")}
          >
            Games
          </button>
        </div>
        <div>
          <button
            className={`px-3 py-1 hover:text-neutral-800 active:text-black ${showContent === "players" ? "bg-white rounded-lg" : ""}`}
            onClick={() => setShowContent("players")}
          >
            Players
          </button>
        </div>
      </div>
      <div>
        {showContent === "games" ? (
          <>
            <ul>
              {initialGames.map(game => (
                <li key={game.id}>{game.date.toString()}</li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <table className="table-auto w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="font-medium text-gray-700">Name</th>
                  <th className="font-medium text-gray-700">Created</th>
                  <th className="font-medium text-gray-700">Last Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {initialPlayers.map(player => (
                  <tr key={player.id}>
                    <td className="py-1">{player.name}</td>
                    <td className="py-1">
                      {new Date(player.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-1">
                      {new Date(player.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-1 text-left relative">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === player.id ? null : player.id)}
                          className="border-neutral-100 border rounded-lg hover:bg-neutral-50 active:bg-neutral-100 transition-colors duration-200 ease-linear"
                        >
                          <Ellipsis className="w-12 text-black" />
                        </button>

                        {openMenuId === player.id && (
                          <div className="absolute left-6 top-full z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg" ref={dropdownRef}>
                            <Link href={`/admin/player/${player.id}`}>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-neutral-100 transition-colors"
                              >
                                Edit {player.name}
                              </button></Link>
                            <button
                              onClick={() => handleDelete(player)}
                              className="w-full text-left px-4 py-2 hover:bg-neutral-100 text-red-600 transition-colors"
                            >
                              Delete {player.name}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}