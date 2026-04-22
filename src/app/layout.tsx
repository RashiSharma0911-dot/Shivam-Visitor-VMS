import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { Background3D } from "@/components/visuals/Background3D";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shivam Informatics | Visitor Management System",
  description: "Next-gen visitor management solution for premium enterprise environments.",
  manifest: "/manifest.json",
  themeColor: "#0099D5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
       <body className="antialiased selection:bg-shivam-gold selection:text-shivam-navy">
        <Background3D />
        <Navbar />
        <main className="pt-24 min-h-screen flex flex-col items-center">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </body>
    </html>
  );
}
