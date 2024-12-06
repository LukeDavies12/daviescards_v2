import { createPlayer } from "../../adminActions";

export default function Page() {
  return (
    <>
      <div className="xl:w-1/2 md:w-3/4 xl:p-6 xl:mx-auto border border-neutral-100 rounded-xl">
        <h1>New Player</h1>
        <form action={createPlayer} className="flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              id="name"
              className="px-3 py-2 rounded-lg border border-neutral-100 hover:border-neutral-300 focus:outline-red-700 transition-colors duration-100 ease-linear"
            />
          </div>
          <button type="submit" className="bg-red-700 rounded-md text-white px-3 py-2 font-semibold text-sm hover:bg-red-600 active:text-red-100 transition-colors duration-100 ease-linear">
            Add
          </button>
        </form>
      </div>
    </>
  )
}