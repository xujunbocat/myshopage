// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    isr: {
      // 用于按需重新生成的密钥 (必须至少32个字符)
      bypassToken: "revalidate-secret-2024-very-long-token-key"
    }
  }),
  integrations: [tailwind()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "fr", "es", "it"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});