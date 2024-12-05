import { db } from "@/db";
import AdminToggle from "./AdminToggle";

export default async function AdminPage() {
  const players = await db.player.findMany();
  const games = await db.game.findMany({
    include: {
      player_scores: {
        include: {
          player: true
        }
      }
    },
  });
  
  return <AdminToggle initialPlayers={players} initialGames={games} />;
}