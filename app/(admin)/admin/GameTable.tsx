import React, { useEffect, useRef, useState } from "react";
import { GameWithPlayerScores } from "./AdminToggle";
import Link from "next/link";
import { Ellipsis } from "lucide-react";

const GameTable = ({ initialGames }: { initialGames: GameWithPlayerScores[] }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const paginatedGames = initialGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

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
    <div className="w-full">
      <div className="grid grid-cols-1 md:hidden gap-4">
        {paginatedGames.map((game) => (
          <div key={game.id} className="bg-white p-4 rounded-lg shadow-md">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(game.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Location:</strong> {game.location}
            </p>
            <p>
              <strong>Players:</strong> {game.player_scores.length}
            </p>
            <p>
              <strong>Message:</strong>{" "}
              {game.message && game.message.length > 30
                ? `${game.message.substring(0, 30)}...`
                : game.message}
            </p>
            <button
              onClick={() => toggleRow(game.id)}
              className="text-blue-500 hover:underline"
            >
              {expandedRow === game.id ? "Hide Details" : "View Details"}
            </button>
            {expandedRow === game.id && (
              <div className="mt-2 text-sm">
                <p>
                  <strong>Full Message:</strong> {game.message}
                </p>
                <p>
                  <strong>Players:</strong>{" "}
                  {game.player_scores
                    .map(
                      (playerScore: any) =>
                        `${playerScore.player.name} (${playerScore.score})`
                    )
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <table className="hidden md:table table-auto w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="font-medium text-gray-700">Date</th>
            <th className="font-medium text-gray-700">Location</th>
            <th className="font-medium text-gray-700">Message</th>
            <th className="font-medium text-gray-700"># of Players</th>
            <th className="font-medium text-gray-700">Players</th>
            <th></th>
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
                <td className="py-1 text-left relative">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === game.id ? null : game.id)}
                      className="border-neutral-100 border hover:bg-neutral-100 active:text-neutral-500 text-neutral-800 transition-colors duration-200 ease-linear rounded-md px-2"
                    >
                      <Ellipsis className="w-6 h-4" />
                    </button>

                    {openMenuId === game.id && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-48 bg-white border border-neutral-200 rounded-md shadow-lg" ref={dropdownRef}>
                        <Link href={`/admin/game/${game.id}`}>
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-neutral-50 active:bg-neutral-100 rounded-md transition-colors"
                          >
                            Edit Game
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              {expandedRow === game.id && (
                <tr>
                  <td colSpan={7}>
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
          length: Math.ceil(initialGames.length / itemsPerPage),
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

export default GameTable;
