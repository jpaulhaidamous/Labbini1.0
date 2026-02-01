'use client';

import { Card, CardContent } from '@/components/ui/card';

interface StatsData {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
}

interface DashboardStatsProps {
  stats: StatsData[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              {stat.change && (
                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold mt-2 text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
