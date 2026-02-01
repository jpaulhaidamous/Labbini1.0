'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface QuickAction {
  label: string;
  href: string;
  icon: string;
  description: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="block p-4 rounded-lg border hover:border-[#1B5E4A] hover:bg-[#1B5E4A]/5 transition-colors"
            >
              <span className="text-2xl block">{action.icon}</span>
              <p className="font-medium text-sm mt-2 text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{action.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
