import { db } from "@/db";
import LeaderboardTable from "../LeaderboardTable";

export default async function IndexPage() {
  const players = await db.player.findMany({
    include: {
      player_scores: {
        include: {
          game: {
            include: {
              player_scores: true,
            },
          },
        },
      }
    }
  })
  const filteredPlayers = players.filter(player => player.player_scores.length > 0);
  const leaderboardData = filteredPlayers.map(player => {
    const totalGames = player.player_scores.length;
    const totalWins = player.player_scores.filter(ps => {
      const highestScoreInGame = Math.max(...ps.game.player_scores.map(gs => gs.score));
      return ps.score === highestScoreInGame;
    }).length;
    const winPercentage = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
    const totalPointsFromWinner = player.player_scores.reduce((acc, ps) => {
      const highestScoreInGame = Math.max(...ps.game.player_scores.map(gs => gs.score));
      return acc + (highestScoreInGame - ps.score);
    }, 0);
    const averagePointsFromWinner = totalGames > 0 ? totalPointsFromWinner / totalGames : 0;
    const gamesRunnerUp = player.player_scores.filter(ps => {
      const scores = ps.game.player_scores.map(gs => gs.score);
      const highestScore = Math.max(...scores);
      const secondHighestScore = Math.max(...scores.filter(score => score < highestScore));
      return ps.score === secondHighestScore;
    }).length;

    return {
      name: player.name,
      totalGames,
      totalWins,
      winPercentage,
      averagePointsFromWinner,
      gamesRunnerUp,
    };
  });
  leaderboardData.sort((a, b) => b.winPercentage - a.winPercentage);

  return (
    <>
      <h1>Leaderboard</h1>
      <LeaderboardTable data={leaderboardData} />
    </>
  );
}