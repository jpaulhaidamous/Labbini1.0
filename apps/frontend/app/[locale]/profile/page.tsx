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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('myProfile')}</h1>
        <ProfileView locale={locale} />
      </div>
    </div>
  );
}
