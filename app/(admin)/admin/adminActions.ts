"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPlayer(formData: FormData) {
  const name = formData.get("name") as string;

  try {
    const player = await db.player.create({
      data: { name },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePlayer(playerId: string, formData: FormData) {
  const name = formData.get("name") as string;

  try {
    const player = await db.player.update({
      where: { id: playerId },
      data: { name },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/");
  redirect("/admin");
}

interface PlayerScore {
  playerId?: string;
  score?: number;
}

export async function createGame(formData: FormData) {
  try {
    const date = formData.get("date");
    const message = formData.get("message");
    const location = formData.get("location");
    const playersAndScores: { [key: string]: PlayerScore } = {};

    Array.from(formData.entries())
      .filter(([key]) => key.startsWith("player-"))
      .forEach(([key, value]) => {
        const index = key.split("-")[1];
        if (!playersAndScores[index]) playersAndScores[index] = {};
        playersAndScores[index].playerId = value.toString();
      });

    Array.from(formData.entries())
      .filter(([key]) => key.startsWith("score-"))
      .forEach(([key, value]) => {
        const index = key.split("-")[1];
        playersAndScores[index].score = parseInt(value.toString(), 10);
      });

    if (!date || isNaN(Date.parse(date.toString()))) {
      throw new Error("Invalid or missing date.");
    }

    if (!Object.keys(playersAndScores).length) {
      throw new Error("At least one player and score are required.");
    }

    const game = await db.game.create({
      data: {
        date: new Date(date.toString()),
        message: message?.toString() || null,
        location: location?.toString() || null,
        player_scores: {
          create: Object.values(playersAndScores).map(
            ({ playerId, score }) => ({
              player: { connect: { id: playerId } },
              score: score ?? 0,
            })
          ),
        },
      },
    });
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/", 'layout');
  redirect("/");
}

export async function updateGame(gameId: string, formData: FormData) {
  const date = formData.get("date");
  const message = formData.get("message");
  const location = formData.get("location");
  const playersAndScores: { [key: string]: PlayerScore } = {};

  Array.from(formData.entries())
    .filter(([key]) => key.startsWith("player-"))
    .forEach(([key, value]) => {
      const index = key.split("-")[1];
      if (!playersAndScores[index]) playersAndScores[index] = {};
      playersAndScores[index].playerId = value.toString();
    });

  Array.from(formData.entries())
    .filter(([key]) => key.startsWith("score-"))
    .forEach(([key, value]) => {
      const index = key.split("-")[1];
      playersAndScores[index].score = parseInt(value.toString(), 10);
    });

  if (!date || isNaN(Date.parse(date.toString()))) {
    throw new Error("Invalid or missing date.");
  }

  if (!Object.keys(playersAndScores).length) {
    throw new Error("At least one player and score are required.");
  }

  try {
    const game = await db.game.update({
      where: { id: gameId },
      data: {
        date: new Date(date.toString()),
        message: message?.toString() || null,
        player_scores: {
          deleteMany: {},
          create: Object.values(playersAndScores).map((ps) => ({
            player: { connect: { id: ps.playerId } },
            score: ps.score ?? 0,
          })),
        },
      },
      include: {
        player_scores: {
          include: {
            player: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/");
  redirect("/admin");
}

export async function deleteGame(id: string) {
  await db.playerScore.deleteMany({
    where: { game_id: id },
  });

  const game = await db.game.delete({
    where: { id },
  });

  if (!game) {
    throw new Error("Game not deleted.");
  }

  revalidatePath("/");
}
