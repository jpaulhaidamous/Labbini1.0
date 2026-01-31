import { getTranslations } from 'next-intl/server';
import PublicProfileView from './PublicProfileView';

interface PublicProfilePageProps {
  params: {
    locale: string;
    userId: string;
  };
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { locale, userId } = params;
  const t = await getTranslations('profile');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PublicProfileView locale={locale} userId={userId} />
      </div>
    </div>
  );
}
