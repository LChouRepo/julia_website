// src/app/layout.tsx
import "./globals.css"
import type { ReactNode } from "react"
import Script from "next/script"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load Netlify Identity widget globally so invite/reset tokens are processed */}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="beforeInteractive"
        />
        {/* If someone lands on /.netlify/identity/*, send them to /admin with the token */}
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
