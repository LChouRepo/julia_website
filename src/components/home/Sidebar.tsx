import { getLang } from "@/lib/lang"
import SidebarClient from "./SidebarClient"

export default async function Sidebar() {
  const lang = await getLang()

  const labels = {
    about: lang === "de" ? "Biografie" : "About",
    concerts: lang === "de" ? "Konzerte" : "Concerts",
    media: lang === "de" ? "Medien" : "Media",
    contact: lang === "de" ? "Kontakt" : "Contact",
  }

  return <SidebarClient lang={lang} labels={labels} />
}
