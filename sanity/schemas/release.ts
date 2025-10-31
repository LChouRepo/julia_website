import { defineField, defineType } from "sanity"

export default defineType({
  name: "release",
  title: "Release",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", type: "string" }),
    defineField({ name: "cover", type: "image", options: { hotspot: true } }),
    defineField({
      name: "links",
      type: "array",
      of: [{ type: "object", fields: [
        { name: "label", type: "string" },
        { name: "href", type: "url" },
      ]}],
    }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 } }),
  ],
})
