import { defineField, defineType } from "sanity"

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "venue", type: "string" }),
    defineField({ name: "city", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 } }),
    defineField({ name: "ticketUrl", type: "url" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
  ],
})
