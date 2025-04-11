import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { PostHogProvider } from "./providers/posthog";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Tdata",
    default: "Tdata",
  },
  applicationName: "Tdata",
  description: "Your Project Management Solution",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [{ url: "/logo.svg" }],
  },
};

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900", "1000"],
  style: ["normal"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} h-svh w-svh overflow-auto`}>
        <ScrollArea className="h-full w-full">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="kanban-theme">
            <PostHogProvider>{children}</PostHogProvider>
          </ThemeProvider>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <Toaster position="top-right" expand richColors />
      </body>
    </html>
  );
}
