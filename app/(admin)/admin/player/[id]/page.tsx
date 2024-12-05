import { db } from "@/db";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  if (!slug) {
    return <div>Error: Player ID is missing</div>;
  }

  const player = await db.player.findUnique({
    where: { id: slug },
  });

  if (!player) {
    return <div>Error: Player not found</div>;
  }

  return <div>Player: {player.name}</div>;
}
