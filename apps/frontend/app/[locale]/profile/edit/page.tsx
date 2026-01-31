import { getTranslations } from 'next-intl/server';
import ProfileEditView from './ProfileEditView';

interface EditProfilePageProps {
  params: {
    locale: string;
  };
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
  const { locale } = params;
  const t = await getTranslations('profile');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t('editProfile')}</h1>
        <ProfileEditView locale={locale} />
      </div>
    </div>
  );
}
