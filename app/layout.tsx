import { CookieBanner } from "@/components/CookieBanner";
import './globals.css';
import { Oswald, JetBrains_Mono } from 'next/font/google';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata = {
  title: 'Tattoos by Jake Llewellyn',
  description: 'At Tattoos by jakellewellyn, I offer a range of services to cater to your individual tattoo needs. I specialise in custom designs, client-specified artwork, and cover-ups (depending on the existing design). All tattoo styles are welcome, ensuring your body art is exactly as you envision it.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white font-sans antialiased min-h-screen selection:bg-white selection:text-black">
        {children}
              <CookieBanner />
      </body>
    </html>
  );
}