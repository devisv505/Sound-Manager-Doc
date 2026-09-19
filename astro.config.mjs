import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  site: 'https://devisv505.github.io',
  base: '/Sound-Manager-Doc',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    starlight({
      title: 'Sound Manager',
      description: 'Small scenes. Expressive sound. The DEV505 Sound Manager documentation.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/theme.css'],
      credits: false,
      disable404Route: false,
      components: {
        Header: './src/components/Header.astro',
        PageTitle: './src/components/PageTitle.astro',
        Footer: './src/components/Footer.astro',
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/Empty.astro',
      },
      expressiveCode: {
        themes: ['github-dark'],
        styleOverrides: {
          borderRadius: '12px',
          codeFontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
          codeFontSize: '0.86rem',
          codeBackground: '#22382e',
        },
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Welcome', link: '/' },
            { label: 'Your first sound', slug: 'getting-started' },
          ],
        },
        {
          label: 'Use in code',
          items: [
            { label: 'API overview', slug: 'api' },
            { label: 'SoundBus', slug: 'api/sound-bus' },
            { label: 'Start, loop & stop', slug: 'recipes/campfire-loop' },
          ],
        },
        {
          label: 'Explore the demos',
          items: [
            { label: 'The sound lab', slug: 'demos' },
            { label: '01 · Campfire', slug: 'demos/01-campfire' },
          ],
        },
      ],
    }),
  ],
});
