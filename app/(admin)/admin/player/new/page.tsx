import { createPlayer } from "../../adminActions";

export default function Page() {
  return (
    <>
      <div className="xl:w-1/2 md:w-3/4 xl:p-6 xl:mx-auto border border-neutral-100 rounded-xl">
        <h1>New Player</h1>
        <form action={createPlayer} className="flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              id="name"
            />
          </div>
          <button type="submit" className="primary">
            Add
          </button>
        </form>
      </div>
    </>
  )
}