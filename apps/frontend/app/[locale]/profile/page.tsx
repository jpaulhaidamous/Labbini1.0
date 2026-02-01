import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import ProfileView from './ProfileView';

interface ProfilePageProps {
  params: {
    locale: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = params;
  const t = await getTranslations('profile');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('myProfile')}</h1>
          <ProfileView locale={locale} />
        </div>
      </div>
    </div>
  );
}
