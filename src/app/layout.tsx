// src/app/layout.tsx
import "./globals.css"
import type { ReactNode } from "react"
import Script from "next/script"
import { Cinzel } from "next/font/google"

const cinzel = Cinzel({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cinzel.variable}>
      <head>
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="beforeInteractive"
        />
        <Script id="identity-redirect" strategy="beforeInteractive">{`
          (function () {
            try {
              var p = window.location.pathname || "";
              if (p.indexOf("/.netlify/identity/") === 0) {
                var q = window.location.search || "";
                window.location.replace("/admin" + q);
              }
            } catch (e) {}
          })();
        `}</Script>
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
