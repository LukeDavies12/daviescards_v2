import { db } from "@/db";
import UpdatePlayerForm from "./UpdatePlayerForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const playerId = (await params).id

  if (!playerId) {
    return <div>Error: Player ID is missing</div>;
  }

  const player = await db.player.findUnique({
    where: { id: playerId },
  });

  if (!player) {
    return <div>Error: Player not found</div>;
  }

  return(
    <>
      <div className="xl:w-1/2 md:w-3/4 xl:p-6 xl:mx-auto border border-neutral-100 rounded-xl">
      <h1>Edit Player: {player.name}</h1>
      <UpdatePlayerForm player={player} />
      </div>
    </>
  )
  ;
}
