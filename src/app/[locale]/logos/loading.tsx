export default function Loading() {
  return (
    <main className="container mx-auto flex w-full flex-grow px-6 py-10">
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[23rem_minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-lg border border-base-200 bg-base-100 shadow">
          <div className="p-6">
            <div className="h-12 w-12 animate-pulse rounded-full bg-base-200" />
            <div className="mt-4 h-7 w-40 animate-pulse rounded bg-base-200" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-base-200" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-base-200" />
          </div>
          <div className="border-t border-base-200 p-4">
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-[4.5rem] animate-pulse rounded border border-base-200 bg-base-200/60" />
              ))}
            </div>
          </div>
          <div className="border-t border-base-200 p-4">
            <div className="h-4 w-20 animate-pulse rounded bg-base-200" />
            <div className="mt-4 space-y-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 rounded-2xl px-3 py-2.5">
                  <div className="h-6 w-6 animate-pulse rounded-sm bg-base-200" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-base-200" />
                  <div className="h-5 w-10 animate-pulse rounded-full bg-base-200" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="h-[18rem] animate-pulse rounded-2xl border border-base-200 bg-base-100 shadow" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
