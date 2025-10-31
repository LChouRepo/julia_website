export default function Footer({ siteTitle = "Your Ensemble" }: { siteTitle?: string }) {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
        <div className="flex items-center gap-3 text-sm">
          <a className="hover:underline" href="#about">About</a>
          <a className="hover:underline" href="#media">Media</a>
          <a className="hover:underline" href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  )
}
