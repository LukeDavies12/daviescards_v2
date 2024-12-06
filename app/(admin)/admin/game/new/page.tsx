import { db } from "@/db";
import NewGame from "./NewGame";

export default async function Page() {
  const players = await db.player.findMany();

  return (
    <>
      <NewGame players={players} />
    </>
  )
}