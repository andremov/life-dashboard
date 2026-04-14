import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/main.scss';
import { ThemeProvider } from '../hooks/use-theme';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
