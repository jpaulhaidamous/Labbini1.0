'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useMessagesStore } from '@/lib/stores/messages.store';

export function Header() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loadUser, logout } = useAuthStore();
  const { unreadCount, fetchUnreadCount } = useMessagesStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchUnreadCount]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const locale = pathname?.startsWith('/ar') ? 'ar' : 'en';

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push(`/${locale}/login`);
  };

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
              {locale === 'ar' ? 'لبّيني' : 'Labbini'}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/jobs`}
              className="text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
            >
              {t('browseJobs')}
            </Link>
            <Link
              href={`/${locale}/freelancers`}
              className="text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
            >
              {t('findFreelancers')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
                >
                  {t('dashboard')}
                </Link>
                {/* Messages with unread badge */}
                <Link
                  href={`/${locale}/messages`}
                  className="relative text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
                >
                  {t('messages')}
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-[#C75D3A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {user?.role === 'CLIENT' && (
                  <Link
                    href={`/${locale}/wallet`}
                    className="text-[#5A5A5A] hover:text-[#1B5E4A] font-medium transition-colors"
                  >
                    {t('wallet')}
                  </Link>
                )}
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
              <div className="relative" ref={dropdownRef}>
                {/* User Avatar Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1B5E4A] flex items-center justify-center text-white text-sm font-semibold">
                    {(user.profile?.displayNameEn || user.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-[#5A5A5A] hidden sm:inline max-w-[100px] truncate">
                    {user.profile?.displayNameEn || user.email.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-400">▼</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
                    <Link
                      href={`/${locale}/dashboard`}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1B5E4A]/5 hover:text-[#1B5E4A]"
                    >
                      {t('dashboard')}
                    </Link>
                    <Link
                      href={`/${locale}/profile`}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1B5E4A]/5 hover:text-[#1B5E4A]"
                    >
                      {t('profile')}
                    </Link>
                    <Link
                      href={`/${locale}/messages`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1B5E4A]/5 hover:text-[#1B5E4A]"
                    >
                      <span>{t('messages')}</span>
                      {unreadCount > 0 && (
                        <span className="bg-[#C75D3A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                    {user.role === 'CLIENT' && (
                      <Link
                        href={`/${locale}/wallet`}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#1B5E4A]/5 hover:text-[#1B5E4A]"
                      >
                        {t('wallet')}
                      </Link>
                    )}
                    <div className="border-t">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-[#C75D3A] hover:bg-red-50"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href={`/${locale}/login`}>
                  <Button variant="outline" size="sm" className="border-[#1B5E4A] text-[#1B5E4A] hover:bg-[#1B5E4A] hover:text-white">
                    {t('login')}
                  </Button>
                </Link>
                <Link href={`/${locale}/register`}>
                  <Button size="sm" className="bg-[#E8A945] hover:bg-[#F4C06F] text-white">
                    {t('register')}
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
