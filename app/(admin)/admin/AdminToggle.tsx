"use client";

import { Player, Prisma } from "@prisma/client";
import { ArrowRightCircle, Ellipsis, MoveRightIcon } from "lucide-react";
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
      <div className="p-1 bg-neutral-100 inline-flex my-1 rounded-lg text-black">
        <div>
          <button
            className={`px-3 py-1 hover:text-neutral-600 rounded-md transition-colors duration-100 ease-linear active:text-neutral-500 ${showContent === "games" ? "bg-white text-neutral-500 hover:text-neutral-500 shadow-sm" : ""}`}
            onClick={() => setShowContent("games")}
          >
            Games
          </button>
        </div>
        <div>
          <button
            className={`px-3 py-1 hover:text-neutral-600 rounded-md transition-colors duration-100 ease-linear active:text-neutral-500 ${showContent === "players" ? "bg-white text-neutral-500 hover:text-neutral-500 shadow-sm" : ""}`}
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
            <Link href={"/admin/player/new"} className="text-red-700 font-medium my-8 py-1 flex gap-2 items-center">New Player<ArrowRightCircle className="w-4"/></Link>
            <table className="table-auto w-full border-collapse text-left text-sm">
              <thead>
                <tr>
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
                          className="border-neutral-100 border hover:bg-neutral-100 active:text-neutral-500 text-neutral-800 transition-colors duration-200 ease-linear rounded-md px-2"
                        >
                          <Ellipsis className="w-6 h-4" />
                        </button>

                        {openMenuId === player.id && (
                          <div className="absolute left-6 top-full z-10 mt-1 w-48 bg-white border border-neutral-200 rounded-md shadow-lg" ref={dropdownRef}>
                            <Link href={`/admin/player/${player.id}`}>
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-neutral-50 active:bg-neutral-100 rounded-md transition-colors"
                              >
                                Edit {player.name}
                              </button>
                            </Link>
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