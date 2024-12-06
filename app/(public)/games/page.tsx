import { db } from "@/db"
import GamesTablePublic from "./GamesTablePublic";

export default async function Page() {
  const games = await db.game.findMany({
    orderBy: {
      created_at: "desc"
    },
    include: {
      player_scores: {
        include: {
          player: true
        }
      }
    }
  });

  return <GamesTablePublic initialGames={games} />;
}