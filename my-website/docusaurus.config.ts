import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A Comprehensive Guide to Building Intelligent Humanoid Robots',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  // Vercel-friendly config - using localhost as placeholder (will be overridden by Vercel)
  url: 'http://localhost:3000',
  baseUrl: '/',



  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/QadirKhan9/Physical-AI-Humanoid-Robotics-Book/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Plugin to inject environment variables
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
      },
    ],
    () => ({
      name: 'custom-webpack-config',
      configureWebpack: (config, isServer, utils) => {
        const webpack = require('webpack');
        return {
          resolve: {
            fallback: {
              process: require.resolve('process/browser'),
            },
          },
          plugins: [
            new webpack.DefinePlugin({
              'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || 'http://localhost:8000'),
            }),
          ],
        };
      },
    }),
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Physical AI & Humanoid Robotics Book',
      logo: {
        alt: 'Site Logo',
        src: 'img/logo.svg',
        href: '/',
      },
      items: [
{
  type: 'docSidebar',
  sidebarId: 'bookSidebar',
  position: 'left',
  label: 'Book',
},

{
  type: 'dropdown',
  label: 'Account',
  position: 'right',
  items: [
    {
      label: 'Dashboard',
      to: '/dashboard',
    },
    {
      label: 'Profile',
      to: '/profile',
    },
    {
      label: 'Sign out',
      to: '/',

    },
    {
      label: 'Add another account',
      to: '/signup',

    }
    ],
},
{
  href: 'https://github.com/QadirKhan9/Physical-AI-Humanoid-Robotics-Book',
  label: 'GitHub',
  position: 'right',
},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/QadirKhan9/Physical-AI-Humanoid-Robotics-Book',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Book`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
