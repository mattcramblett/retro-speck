import { Title } from "@/components/brand/title";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="max-w-[30em] md:max-w-[60em] w-full">
        <Title className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl p-2 md:p-4 whitespace-normal">
          Team Restrospectives done better.
        </Title>
      </div>
    </main>
  );
}
