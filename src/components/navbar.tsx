"use client"
import { useState } from "react"
import { Menu, X, Music2 } from "lucide-react"

export default function Navbar({ siteTitle = "Your Ensemble" }: { siteTitle?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <nav className="container flex items-center justify-between py-3">
        <a href="#home" className="text-lg font-semibold tracking-wide">{siteTitle}</a>
        <div className="hidden items-center md:flex">
          <a className="px-3 py-2 text-sm text-gray-600 hover:text-black" href="#events">Concerts</a>
          <a className="px-3 py-2 text-sm text-gray-600 hover:text-black" href="#about">About</a>
          <a className="px-3 py-2 text-sm text-gray-600 hover:text-black" href="#media">Media</a>
          <a className="px-3 py-2 text-sm text-gray-600 hover:text-black" href="#contact">Contact</a>
          <a className="btn btn-primary ml-3 text-sm" href="#media"><Music2 className="h-4 w-4" /> Listen</a>
        </div>
        <button className="md:hidden btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="border-t bg-white md:hidden">
          <div className="container flex flex-col py-2">
            <a className="py-2" href="#events" onClick={() => setOpen(false)}>Concerts</a>
            <a className="py-2" href="#about" onClick={() => setOpen(false)}>About</a>
            <a className="py-2" href="#media" onClick={() => setOpen(false)}>Media</a>
            <a className="py-2" href="#contact" onClick={() => setOpen(false)}>Contact</a>
          </div>
        </div>
      )}
    </div>
  )
}
