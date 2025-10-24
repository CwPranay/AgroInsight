import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <main className="p-6 text-center">
      <h1 className="text-3xl font-bold text-yellow-600">{t('title')}</h1>
      <p className="text-gray-700">{t('subtitle')}</p>
    </main>
  );
}
