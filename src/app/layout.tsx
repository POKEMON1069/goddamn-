import type { Metadata, Viewport } from "next";
import LenisProvider from "@/components/LenisProvider";
import Loader from "@/components/loader";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "GODDAMN- — Independent designer & creative developer",
  description:
    "A portfolio of designed and built digital experiences. Contact-sheet framing, rack-focus motion, real work.",
  icons: [{ url: "/favicon.svg" }],
  openGraph: {
    title: "GODDAMN- — Independent designer & creative developer",
    description: "Contact-sheet portfolio. Work laid out as frames that rack into focus as you scroll.",
    type: "website",
    images: [{ url: "/images/og-image.svg", width: 1200, height: 800 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0C0D",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Loader>
          <LenisProvider>
            <Nav />
            <main id="content">{children}</main>
            <Footer />
          </LenisProvider>
        </Loader>
      </body>
    </html>
  );
}
