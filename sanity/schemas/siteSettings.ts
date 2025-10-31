import { defineField, defineType } from "sanity"

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteTitle", type: "string" }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "heroImage", type: "image" }),
    defineField({ name: "contactEmail", type: "string" }),
    defineField({ name: "instagram", type: "url" }),
    defineField({ name: "facebook", type: "url" }),
  ],
})
