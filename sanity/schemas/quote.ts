import { defineField, defineType } from "sanity"

export default defineType({
  name: "quote",
  title: "Press Quote",
  type: "document",
  fields: [
    defineField({ name: "outlet", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", validation: (r) => r.required() }),
  ],
})
