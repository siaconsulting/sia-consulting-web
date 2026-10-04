import localFont from 'next/font/local'

export const brandFont = localFont({
  src: [
    { path: '../app/(frontend)/fonts/Overlock-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../app/(frontend)/fonts/Overlock-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../app/(frontend)/fonts/Overlock-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../app/(frontend)/fonts/Overlock-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../app/(frontend)/fonts/Overlock-Black.ttf', weight: '900', style: 'normal' },
    { path: '../app/(frontend)/fonts/Overlock-BlackItalic.ttf', weight: '900', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-brand',
})

export const bodyFont = localFont({
  src: [
    { path: '../app/(frontend)/fonts/SourceSans3-wght.ttf', weight: '400 700', style: 'normal' },
    { path: '../app/(frontend)/fonts/SourceSans3-Italic-wght.ttf', weight: '400 700', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-body',
})
