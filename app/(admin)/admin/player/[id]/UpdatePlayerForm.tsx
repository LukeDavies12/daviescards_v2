'use client'

import React, { useState } from 'react';
import { Player } from "@prisma/client";
import { updatePlayer } from '../../adminActions';

export default function UpdatePlayerForm({ player }: { player: Player }) {
  const [name, setName] = useState(player.name);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const updatePlayerWithId = updatePlayer.bind(null, player.id)

  return (
    <>
      <form action={updatePlayerWithId} className="flex flex-col gap-8 mt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input
            type="text"
            placeholder="Name"
            name="name"
            id="name"
            className="px-3 py-2 rounded-lg border border-neutral-100 hover:border-neutral-300 focus:outline-red-700 transition-colors duration-100 ease-linear"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <button type="submit" className="bg-red-700 rounded-md text-white px-3 py-2 font-semibold text-sm hover:bg-red-600 active:text-red-100 transition-colors duration-100 ease-linear">
          Update
        </button>
      </form>
    </>
  )
    ;
}