import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VisitPage from "@/components/visit/VisitPage";
import { visitCopy, visitLangs, type VisitLang } from "@/lib/content/visit";

type Params = Promise<{ lang: string }>;
const translated = visitLangs.filter((l) => l !== "en");

export const dynamicParams = false;

export function generateStaticParams() {
  return translated.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  const copy = visitCopy[lang as VisitLang];
  if (!copy) return {};
  return {
    title: copy.title,
    description: copy.intro,
    alternates: { languages: Object.fromEntries(visitLangs.map((l) => [visitCopy[l].htmlLang, visitCopy[l].path])) },
  };
}

export default async function TranslatedVisit({ params }: { params: Params }) {
  const { lang } = await params;
  if (!(translated as readonly string[]).includes(lang)) notFound();
  return <VisitPage lang={lang as VisitLang} />;
}
