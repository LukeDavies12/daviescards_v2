import { db } from "@/db";
import UpdateGameForm from "./UpdateGameForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const gameId = (await params).id

  if (!gameId) {
    return <div>Error: Player ID is missing</div>;
  }

  const game = await db.game.findUnique({
    where: { id: gameId },
    include: {
      player_scores: {
        include: {
          player: true
        }
      }
    }
  });

  if (!game) {
    return <div>Error: Player not found</div>;
  }

  const players = await db.player.findMany();

  return (
    <>
      <UpdateGameForm game={game} players={players} />
    </>
  )
    ;
}
