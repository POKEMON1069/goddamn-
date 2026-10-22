import WorkGrid from "@/components/work-grid";

export const metadata = {
  title: "Work — GODDAMN-",
  description: "All work from the contact sheet.",
};

export default function Work() {
  return <WorkGrid featuredOnly={false} />;
}
