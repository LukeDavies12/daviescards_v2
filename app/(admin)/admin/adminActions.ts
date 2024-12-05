"use server";

import { db } from "@/db";
import { Game } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createPlayer(name: string) {
  try {
    const player = await db.player.create({
      data: { name },
    });
    revalidatePath("/admin");
    return { success: true, player };
  } catch (error) {
    return { success: false, error: "Failed to create player" };
  }
}

export async function deletePlayer(id: string) {
  try {
    await db.player.delete({
      where: { id },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete player" };
  }
}

export async function createGame(gameData: Omit<Game, "id" | "created_at" | "updated_at"> & { player_scores: { player_id: string; score: number }[] }) {
  try {
    const game = await db.game.create({
      data: {
        date: new Date(gameData.date),
        message: gameData.message,
        player_scores: {
          create: gameData.player_scores.map(ps => ({
            player: { connect: { id: ps.player_id } },
            score: ps.score
          }))
        }
      },
      include: {
        player_scores: {
          include: {
            player: true
          }
        }
      }
    });
    revalidatePath("/admin");
    return { success: true, game };
  } catch (error) {
    return { success: false, error: "Failed to create game" };
  }
}

export async function updateGame(gameData: Omit<Game, "created_at" | "updated_at"> & { player_scores: { player_id: string; score: number }[] }) { // Updated type definition
  try {
    const game = await db.game.update({
      where: { id: gameData.id },
      data: {
        date: new Date(gameData.date),
        message: gameData.message,
        player_scores: {
          deleteMany: {},
          create: gameData.player_scores.map(ps => ({
            player: { connect: { id: ps.player_id } },
            score: ps.score
          }))
        }
      },
      include: {
        player_scores: {
          include: {
            player: true
          }
        }
      }
    });
    revalidatePath("/admin");
    return { success: true, game };
  } catch (error) {
    return { success: false, error: "Failed to update game" };
  }
}

export async function deleteGame(id: string) {
  try {
    await db.game.delete({
      where: { id },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete game" };
  }
}
