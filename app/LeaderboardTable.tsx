'use client'

import React, { useState, useMemo } from 'react';

interface LeaderboardData {
  name: string;
  totalGames: number;
  totalWins: number;
  winPercentage: number;
  averagePointsFromWinner: number;
  gamesRunnerUp: number;
}

interface LeaderboardTableProps {
  data: LeaderboardData[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaderboardData; direction: 'ascending' | 'descending' } | null>(null);
  const [minGames, setMinGames] = useState<string>('1');

  const filteredData = useMemo(() => {
    const minGamesNumber = Number(minGames) || 0;
    return data.filter(player => player.totalGames >= minGamesNumber);
  }, [data, minGames]);

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof LeaderboardData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleMinGamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinGames(e.target.value);
  };

  const handleMinGamesBlur = () => {
    if (minGames === '') {
      setMinGames('0');
    }
  };

  const maxWinPercentage = Math.max(...sortedData.map(player => player.winPercentage));
  const maxAvgPointsFromWin = Math.max(...sortedData.map(player => player.averagePointsFromWinner));

  return (
    <>
      <div className='mt-4 flex gap-2 items-start'>
        <div>
          <label htmlFor="minGames" className='text-neutral-500'>Games played</label> <br />
          <input
            type="number"
            id="minGames"
            value={minGames}
            onChange={handleMinGamesChange}
            onBlur={handleMinGamesBlur}
            className="border rounded px-2 py-1 inline-block"
            min={1}
          />
        </div>
      </div>
      <div className='grid md:grid-cols-2 gap-8 mt-4'>
        <div>
          <div className="space-y-2 mt-2 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
            <h2>Win Percentage</h2>
            {sortedData
              .slice()
              .sort((a, b) => b.winPercentage - a.winPercentage)
              .map((player, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-20 text-sm text-neutral-500">{player.name}</span>
                  <div className="flex-grow bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-red-700 h-full"
                      style={{ width: `${(player.winPercentage / maxWinPercentage) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-16 text-right text-sm">{player.winPercentage.toFixed(1)}%</span>
                </div>
              ))}
          </div>
        </div>
        <div>
          <div className="space-y-2 mt-2 bg-white shadow-lg rounded-lg p-4 border border-gray-200">
            <h2>Avg Points from Win</h2>
            {sortedData
              .slice()
              .sort((a, b) => a.averagePointsFromWinner - b.averagePointsFromWinner)
              .map((player, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-20 text-sm text-neutral-500">{player.name}</span>
                  <div className="flex-grow bg-gray-100 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-700 h-full"
                      style={{ width: `${(player.averagePointsFromWinner / maxAvgPointsFromWin) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-16 text-right text-sm">{player.averagePointsFromWinner.toFixed(1)} pts</span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <table className="min-w-full table-auto text-sm mt-6">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')} className='text-left tracking-wider cursor-pointer font-medium text-gray-700'>Player</th>
            <th onClick={() => requestSort('winPercentage')} className='text-right tracking-wider cursor-pointer font-medium text-gray-700'>Win %</th>
            <th onClick={() => requestSort('totalGames')} className='text-right tracking-wider cursor-pointer font-medium text-gray-700'>Games</th>
            <th onClick={() => requestSort('totalWins')} className='text-right tracking-wider cursor-pointer font-medium text-gray-700'>Wins</th>
            <th onClick={() => requestSort('gamesRunnerUp')} className='text-right tracking-wider cursor-pointer font-medium text-gray-700'>Runner Up</th>
            <th onClick={() => requestSort('averagePointsFromWinner')} className='text-right tracking-wider cursor-pointer font-medium text-gray-700'>Avg Points from Win</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {sortedData.map((player, index) => (
            <tr key={index}>
              <td className='whitespace-nowrap'>{player.name}</td>
              <td className='text-right'>{player.winPercentage.toFixed(1)}%</td>
              <td className='text-right'>{player.totalGames}</td>
              <td className='text-right'>{player.totalWins}</td>
              <td className='text-right'>{player.gamesRunnerUp}</td>
              <td className='text-right'>{player.averagePointsFromWinner.toFixed(1)} pts</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default LeaderboardTable;

