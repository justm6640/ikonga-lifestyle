
import type { Metadata } from 'next';
import { Poppins, DM_Serif_Display } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IKONGA Lifestyle',
  description: 'Votre partenaire minceur et bien-être',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${poppins.variable} ${dmSerif.variable}`} suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
