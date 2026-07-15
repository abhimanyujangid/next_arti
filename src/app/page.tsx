import type { Metadata } from "next";

import { HomeView } from "@/feature/catalog/views/home-view";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return <HomeView />;
}
