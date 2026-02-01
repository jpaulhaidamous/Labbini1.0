'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Card, CardContent } from '@/components/ui/card';
import ReviewForm from '@/components/reviews/ReviewForm';

interface ReviewViewProps {
  locale: string;
  contractId: string;
}

export default function ReviewView({ locale, contractId }: ReviewViewProps) {
  const t = useTranslations('reviews');
  const router = useRouter();
  const { user, isReady } = useAuthGuard(locale);

  if (!isReady) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <ReviewForm
          contractId={contractId}
          onSuccess={() => {
            setTimeout(() => {
              router.push(`/${locale}/contracts/${contractId}`);
            }, 2000);
          }}
        />
      </CardContent>
    </Card>
  );
}
