import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://juliaxiaozhuowang.com',
  trailingSlash: 'ignore',
  i18n: { locales: ['en', 'de'], defaultLocale: 'en', routing: { prefixDefaultLocale: false } },
})
