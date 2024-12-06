"use server";

import { db } from "@/db";
import { Game } from "@prisma/client";
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

  revalidatePath("/admin");
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
        const index = key.split("-")[1]; // Extract index
        if (!playersAndScores[index]) playersAndScores[index] = {};
        playersAndScores[index].playerId = value.toString();
      });

    Array.from(formData.entries())
      .filter(([key]) => key.startsWith("score-"))
      .forEach(([key, value]) => {
        const index = key.split("-")[1]; // Extract index
        playersAndScores[index].score = parseInt(value.toString(), 10);
      });

    // Validate date
    if (!date || isNaN(Date.parse(date.toString()))) {
      throw new Error("Invalid or missing date.");
    }

    // Validate players and scores
    if (!Object.keys(playersAndScores).length) {
      throw new Error("At least one player and score are required.");
    }

    // Create Game
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

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateGame(
  gameData: Omit<Game, "created_at" | "updated_at"> & {
    player_scores: { player_id: string; score: number }[];
  }
) {
  try {
    const game = await db.game.update({
      where: { id: gameData.id },
      data: {
        date: new Date(gameData.date),
        message: gameData.message,
        player_scores: {
          deleteMany: {},
          create: gameData.player_scores.map((ps) => ({
            player: { connect: { id: ps.player_id } },
            score: ps.score,
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

  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteGame(id: string) {
  try {
    await db.game.delete({
      where: { id },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/admin");
}
