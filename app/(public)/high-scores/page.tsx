import { db } from "@/db";

export default async function Page() {
  const games = await db.game.findMany({
    include: {
      player_scores: {
        include: {
          player: true,
        },
      },
    },
  });

  const scoresByPlayerCount: { [key: number]: { playerName: string; score: number; gameDate: string }[] } = {};

  games.forEach((game) => {
    const playerCount = game.player_scores.length;
    if (!scoresByPlayerCount[playerCount]) {
      scoresByPlayerCount[playerCount] = [];
    }
    game.player_scores.forEach((playerScore) => {
      scoresByPlayerCount[playerCount].push({
        playerName: playerScore.player.name,
        score: playerScore.score,
        gameDate: game.date.toISOString(),
      });
    });
  });

  const categorizedTopScores = Object.entries(scoresByPlayerCount).map(
    ([playerCount, scores]) => ({
      playerCount,
      topScores: scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    })
  );

  return (
    <>
      <h1>Top Scores by Player Count</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {categorizedTopScores.map((category) => (
          <div
            key={category.playerCount}
            className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
          >
            <div className="mb-4">
              <h2>
                {category.playerCount} Players
              </h2>
            </div>
            <ul className="space-y-2">
              {category.topScores.map((score, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <span className="font-medium text-gray-700">
                    {score.playerName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className="bg-red-100 text-red-900 text-sm font-medium px-2.5 py-0.5 rounded"
                    >
                      {score.score}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(score.gameDate).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
