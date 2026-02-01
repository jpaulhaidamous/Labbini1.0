import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';

export function useAuthGuard(locale: string) {
  const router = useRouter();
  const { user, loadUser } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    loadUser().then(() => setChecked(true));
  }, [loadUser]);

  useEffect(() => {
    if (checked && !user) {
      router.push(`/${locale}/login`);
    }
  }, [checked, user, locale, router]);

  return { user, isReady: checked && !!user };
}
