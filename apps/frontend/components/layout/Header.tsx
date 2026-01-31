'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth.store';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loadUser, logout } = useAuthStore();

  useEffect(() => {
    // Load user on mount
    loadUser();
  }, [loadUser]);

  const handleLogout = () => {
    logout();
    router.push('/en/login');
  };

  const locale = pathname?.startsWith('/ar') ? 'ar' : 'en';

  return (
    <header className="sticky top-0 z-50 border-b bg-[#FDF8F3] backdrop-blur supports-[backdrop-filter]:bg-[#FDF8F3]/95 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" fill="#1B5E4A"/>
              <path d="M25 52 L25 30 C25 26 28 23 32 23 L42 23" stroke="#FDF8F3" strokeWidth="5" strokeLinecap="round" fill="none"/>
              <path d="M55 28 L55 50 C55 54 52 57 48 57 L38 57" stroke="#E8A945" strokeWidth="5" strokeLinecap="round" fill="none"/>
              <circle cx="45" cy="23" r="4" fill="#FDF8F3"/>
              <circle cx="35" cy="57" r="4" fill="#E8A945"/>
            </svg>
            <span className="text-2xl font-bold text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Labbini
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/jobs`}
              className="text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              href={`/${locale}/freelancers`}
              className="text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
            >
              Find Freelancers
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/${locale}/profile`}
                  className="text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex gap-2">
              <Link href="/en">
                <Button
                  variant={locale === 'en' ? 'default' : 'ghost'}
                  size="sm"
                  className={locale === 'en' ? 'bg-[#1B5E4A] hover:bg-[#2D7A62]' : ''}
                >
                  EN
                </Button>
              </Link>
              <Link href="/ar">
                <Button
                  variant={locale === 'ar' ? 'default' : 'ghost'}
                  size="sm"
                  className={locale === 'ar' ? 'bg-[#1B5E4A] hover:bg-[#2D7A62]' : ''}
                >
                  AR
                </Button>
              </Link>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#5A5A5A] hidden sm:inline">
                  Welcome, <span className="font-semibold text-[#1B5E4A]">{user.profile?.displayNameEn || user.email}</span>
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-[#C75D3A] text-[#C75D3A] hover:bg-[#C75D3A] hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href={`/${locale}/login`}>
                  <Button variant="outline" size="sm" className="border-[#1B5E4A] text-[#1B5E4A] hover:bg-[#1B5E4A] hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href={`/${locale}/register`}>
                  <Button size="sm" className="bg-[#E8A945] hover:bg-[#F4C06F] text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
