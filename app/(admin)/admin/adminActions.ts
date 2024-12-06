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

export async function createGame(
  gameData: Omit<Game, "id" | "created_at" | "updated_at"> & {
    player_scores: { player_id: string; score: number }[];
  }
) {
  try {
    const game = await db.game.create({
      data: {
        date: new Date(gameData.date),
        message: gameData.message,
        player_scores: {
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
