import { Html, Head, Main, NextScript } from 'next/document';
import { andremovThemeScript } from '@andremov/brand/theme-script';

export default function Document() {
  return (
    // the theme script below stamps a saved light/dark choice before React hydrates
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: andremovThemeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
