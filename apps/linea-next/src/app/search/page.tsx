import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchContent } from "./search-content";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the full LINEA jewelry collection.",
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SearchContent />
    </Suspense>
  );
}
