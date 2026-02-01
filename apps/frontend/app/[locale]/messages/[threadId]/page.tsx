import { getTranslations } from 'next-intl/server';
import MessageThreadView from './MessageThreadView';

interface MessageThreadPageProps {
  params: {
    locale: string;
    threadId: string;
  };
}

export default async function MessageThreadPage({ params }: MessageThreadPageProps) {
  const { locale, threadId } = params;
  const t = await getTranslations('messages');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex border rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <MessageThreadView locale={locale} threadId={threadId} />
          </div>
        </div>
      </div>
    </div>
  );
}
