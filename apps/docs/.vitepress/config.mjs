import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "FrameKit SDK",
  description: "Headless Media SDK Documentation",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Data Wiring SDK', link: '/sdk-docs' },
      { text: 'UI Components SDK', link: '/components-docs' }
    ],
    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Data Wiring SDK', link: '/sdk-docs' },
          { text: 'UI Components SDK', link: '/components-docs' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tarunguduru2811/headless-media-sdk' }
    ]
  }
})
