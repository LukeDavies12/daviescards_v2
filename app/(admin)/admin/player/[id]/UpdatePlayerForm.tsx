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
          <label htmlFor="name" className="font-medium">Name</label>
          <input
            type="text"
            placeholder="Name"
            name="name"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <button type="submit" className="primary">
          Update
        </button>
      </form>
    </>
  )
    ;
}