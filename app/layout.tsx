import type {Metadata} from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import { ProfileProvider } from '@/hooks/use-profile';
import { FoodProvider } from '@/hooks/use-foods';
import { HistoryProvider } from '@/hooks/use-history';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: 'GlicoCalc - Gestão Inteligente de Diabetes',
  description: 'Calculadora de dose de insulina e contagem de carboidratos.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${lexend.variable} dark`}>
      <body className="font-sans bg-[#112116] text-slate-100 min-h-screen" suppressHydrationWarning>
        <ProfileProvider>
          <FoodProvider>
            <HistoryProvider>
              {children}
            </HistoryProvider>
          </FoodProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
