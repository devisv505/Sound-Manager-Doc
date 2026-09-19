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
            { label: 'Managers, libraries & keys', slug: 'guides/setup-and-keys' },
            { label: 'Make your first graph', slug: 'guides/your-first-graph' },
          ],
        },
        {
          label: 'Understand your sounds',
          items: [
            { label: 'Reading path', slug: 'guides' },
            { label: 'Events, plays & voices', slug: 'guides/events-plays-voices' },
            { label: 'Change parameters', slug: 'guides/parameters' },
            { label: 'Position & ownership', slug: 'guides/position-and-ownership' },
            { label: 'Stop, pause & clean up', slug: 'guides/stop-and-pause' },
            { label: 'Signals & notifications', slug: 'guides/signals-and-notifications' },
            { label: 'Results & limits', slug: 'guides/results-and-limits' },
          ],
        },
        {
          label: 'API reference',
          collapsed: true,
          items: [
            { label: 'API overview', slug: 'api' },
            { label: 'SoundBus', slug: 'api/sound-bus' },
            { label: 'Play context', slug: 'api/context' },
            { label: 'Parameter values & IDs', slug: 'api/parameters' },
            { label: 'Results & handles', slug: 'api/results-and-handles' },
            { label: 'Owners & groups', slug: 'api/ownership' },
            { label: 'Signals & notifications', slug: 'api/notifications' },
            { label: 'Services & extensions', slug: 'api/services' },
            { label: 'Requests', slug: 'api/requests' },
            { label: 'Scene components', slug: 'api/components' },
            { label: 'Keys & assets', slug: 'api/keys-and-assets' },
            { label: 'Playback settings', slug: 'api/settings' },
            { label: 'Coverage inventory', slug: 'api/coverage' },
          ],
        },
        {
          label: 'Use an example',
          items: [{ label: 'Start, loop & stop', slug: 'recipes/campfire-loop' }],
        },
        {
          label: 'Explore the demos',
          items: [
            { label: 'The sound lab', slug: 'demos' },
            { label: 'Unity screenshot library', slug: 'captures' },
            { label: '01 · Campfire', slug: 'demos/01-campfire' },
          ],
        },
      ],
    }),
  ],
});
