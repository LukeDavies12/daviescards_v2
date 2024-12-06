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
      <div className="xl:w-1/2 md:w-3/4 xl:p-6 xl:mx-auto border border-neutral-100 rounded-xl">
        <h1>Edit Game</h1>
        <UpdateGameForm game={game} players={players} />
      </div>
    </>
  )
    ;
}
