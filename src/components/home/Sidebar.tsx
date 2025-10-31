"use client"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react" // install via: npm install lucide-react

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-56 flex-col justify-start bg-transparent p-6 md:flex z-50">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-wide text-white drop-shadow-sm"
        >
          JULIA WANG
        </Link>
        <nav className="mt-6 flex flex-col space-y-2 text-white/90">
          <Link href="/about" className="block hover:underline">About</Link>
          <Link href="/concerts" className="block hover:underline">Concerts</Link>
          <Link href="/media" className="block hover:underline">Media</Link>
          <Link href="/contact" className="block hover:underline">Contact</Link>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-black/60 px-4 py-3 text-white backdrop-blur md:hidden">
        <Link href="/" className="text-lg font-extrabold tracking-wide">
          JULIA WANG
        </Link>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {open && (
        <div className="fixed top-0 right-0 z-40 h-screen w-2/3 bg-black/90 p-8 text-white md:hidden">
          <nav className="flex flex-col space-y-4 text-lg">
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <Link href="/concerts" onClick={() => setOpen(false)}>Concerts</Link>
            <Link href="/media" onClick={() => setOpen(false)}>Media</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </>
  )
}
