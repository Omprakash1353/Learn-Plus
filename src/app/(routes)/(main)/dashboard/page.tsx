export default async function HomePage() {
  // const { cardsData } = await getCourseData();

  return (
    <div className="w-full">
      <div className="flex min-h-screen flex-col overflow-hidden p-4">
        <main className="flex h-auto w-full flex-grow flex-col items-center justify-start gap-10 px-5">
          <div className="mx-auto my-5 grid w-full grid-cols-1 gap-x-5 gap-y-12 px-6 md:grid-cols-2 md:px-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {/* {cardsData.map((card, index) => (
              <CourseProgressCard key={index} {...card} />
            ))} */}
          </div>
        </main>
      </div>
    </div>
  );
}
