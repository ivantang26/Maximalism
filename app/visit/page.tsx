import type { Metadata } from "next";
import VisitPage from "@/components/visit/VisitPage";
import { visitCopy, visitLangs } from "@/lib/content/visit";

export const metadata: Metadata = {
  title: "Plan your visit",
  description: "Opening hours, tickets, getting to Loud House, access information, quiet hours, the sensory map and the canteen.",
  alternates: { languages: Object.fromEntries(visitLangs.map((l) => [visitCopy[l].htmlLang, visitCopy[l].path])) },
};

export default function Visit() {
  return <VisitPage lang="en" />;
}
