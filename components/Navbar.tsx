'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplets, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';

import Image from 'next/image';
import { useProfile } from '@/hooks/use-profile';

export function Navbar() {
  const pathname = usePathname();
  const { profile } = useProfile();

  const navItems = [
    { name: 'Calculadora', href: '/' },
    { name: 'Histórico', href: '/historico' },
    { name: 'Alimentos', href: '/alimentos' },
    { name: 'Relatórios', href: '/relatorios' },
    { name: 'Perfil', href: '/perfil' },
  ];

  return (
    <header className="flex items-center justify-between border-b border-border-green px-8 py-4 bg-bg-dark sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-1.5 rounded-lg">
          <Droplets className="text-bg-dark w-6 h-6 fill-current" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">GlicoCalc</h2>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors relative pb-1 ${
                isActive ? 'text-primary' : 'text-slate-500 hover:text-primary'
              }`}
            >
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg bg-neutral-green/50 text-slate-100 hover:bg-neutral-green transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <Link href="/perfil" className="flex items-center gap-3 group">
          {profile.name && (
            <span className="text-sm font-medium text-slate-300 group-hover:text-primary transition-colors hidden lg:block">
              {profile.name}
            </span>
          )}
          <div className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden group-hover:scale-105 transition-transform relative">
            <Image
              alt="User Profile"
              src={`https://picsum.photos/seed/${profile.name || 'user'}/100/100`}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
