import Hero from "@/components/hero";
import WorkGrid from "@/components/work-grid";

export const metadata = {
  title: "GODDAMN- — Independent designer & creative developer",
  description: "Contact-sheet portfolio. Work laid out as frames that rack into focus as you scroll.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <WorkGrid featuredOnly />
    </>
  );
}
