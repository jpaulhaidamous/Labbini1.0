'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  href?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const t = useTranslations('dashboard');

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      job: 'bg-blue-500',
      proposal: 'bg-purple-500',
      contract: 'bg-green-500',
      payment: 'bg-yellow-500',
      message: 'bg-pink-500',
      review: 'bg-orange-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">{t('noActivity')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${getActivityColor(activity.type)} mt-1.5 flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
