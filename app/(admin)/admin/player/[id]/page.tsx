import { db } from "@/db";

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

  return <div>Player: {player.name}</div>;
}
