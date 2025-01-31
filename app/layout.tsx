import type { Metadata } from 'next';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: 'Cheemba',
  description: 'Cheemba',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased !scroll-smooth max-sm:text-[14px]`}>
        <NextTopLoader color="#0A3B83" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
