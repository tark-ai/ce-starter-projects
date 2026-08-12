import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_NAME } from "@/lib/constants";
import { SearchContent } from "./search-content";

export const metadata: Metadata = {
  title: "Search",
  description: `Search the full ${SITE_NAME} catalog by name, ingredient or ritual.`,
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-background" />}>
      <SearchContent />
    </Suspense>
  );
}
