import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = params;
  const t = await getTranslations('home');
  const tCat = await getTranslations('categories');

  const categories = [
    { icon: '💻', key: 'webDevelopment' as const },
    { icon: '🎨', key: 'graphicDesign' as const },
    { icon: '🔧', key: 'plumbing' as const },
    { icon: '⚡', key: 'electrical' as const },
    { icon: '📱', key: 'mobileApps' as const },
    { icon: '✍️', key: 'writing' as const },
    { icon: '🔨', key: 'carpentry' as const },
    { icon: '🎭', key: 'eventPlanning' as const },
  ];

  const comparisonFeatures = [
    { key: 'featureVerified',   fb: '✗',           ag: 'Partial',       lb: '✓ Full' },
    { key: 'featurePricing',    fb: '✗',           ag: '✗',             lb: '✓ Full' },
    { key: 'featurePayment',    fb: '✗',           ag: 'Sometimes',     lb: '✓ Full' },
    { key: 'featureReviews',    fb: '✗',           ag: '✗',             lb: '✓ Full' },
    { key: 'featureSpeed',      fb: 'Days',        ag: '24–48 hrs',     lb: '< 2 hrs' },
    { key: 'featureCommission', fb: 'Free',        ag: '15–30%',        lb: '10%' },
    { key: 'featureDispute',    fb: '✗',           ag: 'Partial',       lb: '✓ Built-in' },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#FFF8EE] to-[#FDF0E0]">
        <div className="container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center gap-2 bg-[#E8A945] bg-opacity-10 text-[#E8A945] text-sm px-5 py-2 rounded-full font-semibold tracking-wide">
                {t('heroTag')}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-[#2C2C2C] leading-tight mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('heroTitle1')}{' '}
              <span className="text-[#1B5E4A]">{t('heroTitle2')}</span>{' '}
              <span className="text-[#E8A945]">{t('heroTitle3')}</span>{' '}
              <span className="text-[#1B5E4A]">{t('heroTitle4')}</span>
            </h1>

            <p className="text-xl text-[#5A5A5A] leading-relaxed max-w-2xl mx-auto mb-10">
              {t('heroDescription')}
            </p>

            {/* Primary + secondary CTA with clear visual hierarchy */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={`/${locale}/register`}>
                <Button size="lg" className="bg-[#1B5E4A] hover:bg-[#2D7A62] text-white h-14 px-8 text-lg shadow-lg shadow-[#1B5E4A]/25">
                  {t('postFirstJob')}
                </Button>
              </Link>
              <Link href={`/${locale}/register`} className="text-[#1B5E4A] font-semibold hover:text-[#2D7A62] transition-colors text-lg">
                {t('imAProfessional')}
              </Link>
            </div>

            {/* Trust indicators below fold — anchoring via social proof */}
            <div className="flex flex-wrap gap-10 justify-center pt-14 border-t border-[#F5EDE3] mt-14">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1B5E4A]">2,400+</div>
                <div className="text-sm text-[#5A5A5A]">{t('activeProfessionals')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1B5E4A]">1,800+</div>
                <div className="text-sm text-[#5A5A5A]">{t('jobsCompleted')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#1B5E4A]">98%</div>
                <div className="text-sm text-[#5A5A5A]">{t('successRate')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM → SOLUTION ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('problemTitle')}
              </h2>
              <p className="text-lg text-[#5A5A5A]">{t('problemSubtitle')}</p>
            </div>

            {/* Pain points — pattern interruption via red accent */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-[#FDF8F3] border border-red-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-4">📱</div>
                <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">{t('problem1Title')}</h3>
                <p className="text-[#5A5A5A] text-sm leading-relaxed">{t('problem1Desc')}</p>
              </div>
              <div className="bg-[#FDF8F3] border border-red-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-4">🏢</div>
                <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">{t('problem2Title')}</h3>
                <p className="text-[#5A5A5A] text-sm leading-relaxed">{t('problem2Desc')}</p>
              </div>
              <div className="bg-[#FDF8F3] border border-red-100 rounded-2xl p-6">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-4">💸</div>
                <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">{t('problem3Title')}</h3>
                <p className="text-[#5A5A5A] text-sm leading-relaxed">{t('problem3Desc')}</p>
              </div>
            </div>

            {/* Solution bridge — strong green CTA block */}
            <div className="bg-gradient-to-r from-[#1B5E4A] to-[#2D7A62] rounded-3xl p-8 md:p-12 text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('solutionTitle')}
              </h3>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">{t('solutionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-[#FDF8F3]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('howItWorksTitle')}
            </h2>
            <p className="text-lg text-[#5A5A5A]">{t('howItWorksSubtitle')}</p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', color: '#1B5E4A', titleKey: 'step1Title', descKey: 'step1Desc', detailKey: 'step1Detail' },
              { num: '2', color: '#E8A945', titleKey: 'step2Title', descKey: 'step2Desc', detailKey: 'step2Detail' },
              { num: '3', color: '#1B5E4A', titleKey: 'step3Title', descKey: 'step3Desc', detailKey: 'step3Detail' },
            ].map((step) => (
              <div key={step.num} className="relative text-center">
                <div
                  className="w-24 h-24 bg-white shadow-lg rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ border: `4px solid ${step.color}` }}
                >
                  <span className="text-3xl font-bold" style={{ color: step.color }}>{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-3">{t(step.titleKey as any)}</h3>
                <p className="text-[#5A5A5A] leading-relaxed mb-2">{t(step.descKey as any)}</p>
                <p className="text-sm text-[#E8A945] font-semibold">{t(step.detailKey as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE LABBINI ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('whyChoose')}
            </h2>
            <p className="text-lg text-[#5A5A5A] max-w-2xl mx-auto">
              {t('whyChooseDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-l-4 border-[#1B5E4A] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-[#1B5E4A] bg-opacity-10 rounded-xl flex items-center justify-center text-3xl mb-4">
                  🇱🇧
                </div>
                <CardTitle className="text-2xl text-[#2C2C2C]">{t('bolognaFirst')}</CardTitle>
                <CardDescription className="text-base text-[#5A5A5A] leading-relaxed">
                  {t('bolognaFirstDesc')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-[#E8A945] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-[#E8A945] bg-opacity-10 rounded-xl flex items-center justify-center text-3xl mb-4">
                  🔒
                </div>
                <CardTitle className="text-2xl text-[#2C2C2C]">{t('secureEscrow')}</CardTitle>
                <CardDescription className="text-base text-[#5A5A5A] leading-relaxed">
                  {t('secureEscrowDesc')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-[#3D7A8C] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-[#3D7A8C] bg-opacity-10 rounded-xl flex items-center justify-center text-3xl mb-4">
                  🛠️
                </div>
                <CardTitle className="text-2xl text-[#2C2C2C]">{t('allSkills')}</CardTitle>
                <CardDescription className="text-base text-[#5A5A5A] leading-relaxed">
                  {t('allSkillsDesc')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="py-20 bg-[#FDF8F3]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('comparisonTitle')}
            </h2>
            <p className="text-lg text-[#5A5A5A]">{t('comparisonSubtitle')}</p>
          </div>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="p-5 text-left text-sm font-semibold bg-[#2C2C2C] text-white w-2/5" />
                  <th className="p-5 text-center text-sm font-semibold bg-[#2C2C2C] text-white text-opacity-60">{t('facebook')}</th>
                  <th className="p-5 text-center text-sm font-semibold bg-[#2C2C2C] text-white text-opacity-60">{t('agencies')}</th>
                  <th className="p-5 text-center text-sm font-bold bg-[#1B5E4A] text-white">{t('labbini')}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FDF8F3]'}>
                    <td className="p-5 text-sm font-semibold text-[#2C2C2C]">{t(row.key as any)}</td>
                    <td className="p-5 text-center text-sm text-[#5A5A5A]">{row.fb}</td>
                    <td className="p-5 text-center text-sm text-[#5A5A5A]">{row.ag}</td>
                    <td className="p-5 text-center text-sm font-semibold text-[#1B5E4A] bg-[#1B5E4A] bg-opacity-5">
                      {row.lb}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── TRUST & SOCIAL PROOF ─── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('trustTitle')}
            </h2>
            <p className="text-lg text-[#5A5A5A]">{t('trustSubtitle')}</p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Stats grid — anchoring effect via prominent numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
              <div className="bg-[#FDF8F3] rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-[#1B5E4A] mb-2">2,400+</div>
                <div className="text-sm text-[#5A5A5A]">{t('trustVerifiedPros')}</div>
              </div>
              <div className="bg-[#FDF8F3] rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-[#1B5E4A] mb-2">1,800+</div>
                <div className="text-sm text-[#5A5A5A]">{t('trustJobsThisMonth')}</div>
              </div>
              <div className="bg-[#FDF8F3] rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-[#E8A945] mb-2">98%</div>
                <div className="text-sm text-[#5A5A5A]">{t('trustSatisfaction')}</div>
              </div>
              <div className="bg-[#FDF8F3] rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-[#1B5E4A] mb-2">8</div>
                <div className="text-sm text-[#5A5A5A]">{t('trustGovernorates')}</div>
              </div>
            </div>

            {/* Testimonial + Activity feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonial card */}
              <div className="bg-[#FDF8F3] rounded-2xl p-8 border border-[#F5EDE3]">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className="text-[#E8A945] text-lg">★</span>
                  ))}
                </div>
                <p className="text-[#2C2C2C] leading-relaxed mb-6 italic">
                  &ldquo;{t('testimonialText')}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1B5E4A] to-[#2D7A62] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    A
                  </div>
                  <div>
                    <div className="font-bold text-[#2C2C2C]">{t('testimonialName')}</div>
                    <div className="text-sm text-[#5A5A5A]">{t('testimonialRole')}</div>
                  </div>
                </div>
              </div>

              {/* Live activity feed — behavioral psychology: scarcity + social proof */}
              <div className="bg-[#FDF8F3] rounded-2xl p-8 border border-[#F5EDE3]">
                <h4 className="text-lg font-bold text-[#2C2C2C] mb-6">What&apos;s happening now</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-10 h-10 bg-[#1B5E4A] bg-opacity-10 rounded-lg flex items-center justify-center text-lg">📍</div>
                    <div>
                      <div className="text-sm font-semibold text-[#2C2C2C]">{t('activityBeirut')}</div>
                      <div className="text-xs text-[#5A5A5A]">Last updated: just now</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-10 h-10 bg-[#E8A945] bg-opacity-10 rounded-lg flex items-center justify-center text-lg">👥</div>
                    <div>
                      <div className="text-sm font-semibold text-[#2C2C2C]">{t('activityNow')}</div>
                      <div className="text-xs text-[#5A5A5A]">Across all governorates</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-10 h-10 bg-[#3D7A8C] bg-opacity-10 rounded-lg flex items-center justify-center text-lg">⚡</div>
                    <div>
                      <div className="text-sm font-semibold text-[#2C2C2C]">{t('activityFast')}</div>
                      <div className="text-xs text-[#5A5A5A]">Today&apos;s average</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 bg-[#FDF8F3]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t('popularCategories')}
            </h2>
            <p className="text-lg text-[#5A5A5A]">
              {t('categoriesDescription')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.key}
                href={`/${locale}/jobs`}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 group border border-[#F5EDE3] hover:border-[#1B5E4A]"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <div className="text-base font-semibold text-[#2C2C2C] group-hover:text-[#1B5E4A] transition-colors">
                  {tCat(category.key)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 bg-gradient-to-r from-[#1B5E4A] to-[#2D7A62] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('readyToStart')}
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            {t('readyDescription')}
          </p>
          {/* Two-path CTA — reduces friction by matching user intent */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={`/${locale}/register`}>
              <Button size="lg" className="bg-[#E8A945] hover:bg-[#F4C06F] text-white h-14 px-8 text-lg shadow-lg shadow-black/20">
                {t('registerAsClient')}
              </Button>
            </Link>
            <Link href={`/${locale}/register`}>
              <Button size="lg" variant="outline" className="bg-white bg-opacity-10 border-white border-opacity-30 text-white hover:bg-opacity-20 h-14 px-8 text-lg">
                {t('registerAsFreelancer')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#2C2C2C] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="38" fill="#1B5E4A"/>
                  <path d="M25 52 L25 30 C25 26 28 23 32 23 L42 23" stroke="#FDF8F3" strokeWidth="5" strokeLinecap="round" fill="none"/>
                  <path d="M55 28 L55 50 C55 54 52 57 48 57 L38 57" stroke="#E8A945" strokeWidth="5" strokeLinecap="round" fill="none"/>
                  <circle cx="45" cy="23" r="4" fill="#FDF8F3"/>
                  <circle cx="35" cy="57" r="4" fill="#E8A945"/>
                </svg>
                <span className="text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {locale === 'ar' ? 'لبّيني' : 'Labbini'}
                </span>
              </div>
              <p className="text-sm text-gray-400">
                {t('footerDescription')}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('forClients')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href={`/${locale}/jobs/post`} className="hover:text-white transition-colors">{t('postJob')}</Link></li>
                <li><Link href={`/${locale}/freelancers`} className="hover:text-white transition-colors">{t('browseFreelancers')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('howItWorks')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('forFreelancers')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href={`/${locale}/jobs`} className="hover:text-white transition-colors">{t('findJobs')}</Link></li>
                <li><Link href={`/${locale}/register`} className="hover:text-white transition-colors">{t('createProfile')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('successStories')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('support')}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">{t('helpCenter')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('contactUs')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('termsOfService')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>{t('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
