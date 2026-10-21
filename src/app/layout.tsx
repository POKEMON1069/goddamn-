import type { Metadata, Viewport } from "next";
import "@/styles/fonts.css";
import "@/styles/global.css";
import { site } from "@/data/site";
import { SmoothScroll } from "@/lib/engine/SmoothScroll";
import { MotionRoot } from "@/lib/engine/MotionRoot";
import { Preloader } from "@/lib/engine/Preloader";
import { TransitionProvider } from "@/lib/engine/Transitions";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s · Nila Raghunathan",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "independent designer",
    "creative developer",
    "Chennai",
    "identity design",
    "web design",
    "editorial design",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_IN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "A sheet of cotton paper curled through a letterpress, lit hard from the left.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#f4efe4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Designer and developer",
  url: site.url,
  email: `mailto:${site.email}`,
  description: site.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  knowsAbout: ["Identity design", "Web design", "Front end development", "Editorial design"],
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/archivo-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Preloader />
        <TransitionProvider>
          <SmoothScroll />
          <MotionRoot />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </TransitionProvider>
        <script
          type="application/ld+json"
          // Static, author-controlled JSON-LD.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
