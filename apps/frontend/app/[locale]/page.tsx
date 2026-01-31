import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#FFF4E0]">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="inline-block bg-[#E8A945] bg-opacity-10 text-[#E8A945] text-sm px-4 py-2 rounded-full font-semibold tracking-wide uppercase">
                Lebanon's #1 Marketplace
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#2C2C2C] leading-tight" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Find Your <span className="text-[#1B5E4A]">Expert</span><br />
              Get Things <span className="text-[#E8A945]">Done</span>
            </h1>
            <p className="text-xl text-[#5A5A5A] leading-relaxed">
              Connect with skilled freelancers and tradespeople across Lebanon. From web developers to plumbers, find the right person for any job.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/en/jobs">
                <Button size="lg" className="bg-[#1B5E4A] hover:bg-[#2D7A62] text-white h-14 px-8 text-lg">
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/en/freelancers">
                <Button size="lg" variant="outline" className="border-2 border-[#E8A945] text-[#E8A945] hover:bg-[#E8A945] hover:text-white h-14 px-8 text-lg">
                  Find Freelancers
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-[#F5EDE3]">
              <div>
                <div className="text-3xl font-bold text-[#1B5E4A]">1000+</div>
                <div className="text-sm text-[#5A5A5A]">Active Professionals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B5E4A]">500+</div>
                <div className="text-sm text-[#5A5A5A]">Jobs Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#1B5E4A]">98%</div>
                <div className="text-sm text-[#5A5A5A]">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#E8A945]">
              <div className="aspect-square bg-gradient-to-br from-[#1B5E4A] to-[#2D7A62] rounded-2xl flex items-center justify-center">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="95" fill="url(#heroGradient)"/>
                  <defs>
                    <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDF8F3"/>
                      <stop offset="100%" stopColor="#E8A945"/>
                    </linearGradient>
                  </defs>
                  <path d="M60 130 L60 75 C60 65 68 58 78 58 L95 58"
                        stroke="#1B5E4A" strokeWidth="12" strokeLinecap="round" fill="none"/>
                  <path d="M140 70 L140 125 C140 135 132 142 122 142 L105 142"
                        stroke="#E8A945" strokeWidth="12" strokeLinecap="round" fill="none"/>
                  <circle cx="105" cy="58" r="10" fill="#1B5E4A"/>
                  <circle cx="95" cy="142" r="10" fill="#E8A945"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Why Choose Labbini?
            </h2>
            <p className="text-xl text-[#5A5A5A] max-w-2xl mx-auto">
              Built for Lebanese, by Lebanese - with features that matter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-[#1B5E4A] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-[#1B5E4A] rounded-xl flex items-center justify-center text-3xl mb-4">
                  🇱🇧
                </div>
                <CardTitle className="text-2xl text-[#2C2C2C]">Lebanon-First</CardTitle>
                <CardDescription className="text-base text-[#5A5A5A] leading-relaxed">
                  Local payment methods (OMT, Whish), Arabic support, and all 8 Lebanese governorates. We understand your needs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-[#E8A945] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-[#E8A945] rounded-xl flex items-center justify-center text-3xl mb-4">
                  🔒
                </div>
                <CardTitle className="text-2xl text-[#2C2C2C]">Secure Escrow</CardTitle>
                <CardDescription className="text-base text-[#5A5A5A] leading-relaxed">
                  Your money is protected. Funds are held in escrow and only released when work is approved. Safe for everyone.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-[#3D7A8C] shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 bg-[#3D7A8C] rounded-xl flex items-center justify-center text-3xl mb-4">
                  🛠️
                </div>
                <CardTitle className="text-2xl text-[#2C2C2C]">All Skills Welcome</CardTitle>
                <CardDescription className="text-base text-[#5A5A5A] leading-relaxed">
                  From coding to carpentry, design to plumbing. Every skill has value, every worker deserves opportunity.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#FDF8F3]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Popular Categories
            </h2>
            <p className="text-xl text-[#5A5A5A]">
              Explore services across every industry
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '💻', name: 'Web Development', nameAr: 'تطوير المواقع', color: '#3D7A8C' },
              { icon: '🎨', name: 'Graphic Design', nameAr: 'التصميم الجرافيكي', color: '#E8A945' },
              { icon: '🔧', name: 'Plumbing', nameAr: 'سباكة', color: '#1B5E4A' },
              { icon: '⚡', name: 'Electrical', nameAr: 'كهرباء', color: '#C75D3A' },
              { icon: '📱', name: 'Mobile Apps', nameAr: 'تطبيقات الجوال', color: '#3D7A8C' },
              { icon: '✍️', name: 'Writing', nameAr: 'كتابة', color: '#8B6F4E' },
              { icon: '🔨', name: 'Carpentry', nameAr: 'نجارة', color: '#1B5E4A' },
              { icon: '🎭', name: 'Event Planning', nameAr: 'تنظيم فعاليات', color: '#E8A945' },
            ].map((category) => (
              <Card
                key={category.name}
                className="bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <CardHeader className="text-center">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg text-[#2C2C2C]">{category.name}</CardTitle>
                  <CardDescription className="text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {category.nameAr}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1B5E4A] to-[#2D7A62] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of clients and freelancers finding success on Labbini
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/en/register">
              <Button size="lg" className="bg-[#E8A945] hover:bg-[#F4C06F] text-white h-14 px-8 text-lg">
                Register for Free
              </Button>
            </Link>
            <Link href="/en/jobs">
              <Button size="lg" variant="outline" className="bg-white text-[#1B5E4A] hover:bg-[#F5EDE3] border-0 h-14 px-8 text-lg">
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                <span className="text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>Labbini</span>
              </div>
              <p className="text-sm text-gray-400">
                Lebanon's trusted marketplace for freelance services and skilled trades
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/en/jobs" className="hover:text-white">Post a Job</Link></li>
                <li><Link href="/en/freelancers" className="hover:text-white">Browse Freelancers</Link></li>
                <li><Link href="#" className="hover:text-white">How it Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/en/jobs" className="hover:text-white">Find Jobs</Link></li>
                <li><Link href="/en/register" className="hover:text-white">Create Profile</Link></li>
                <li><Link href="#" className="hover:text-white">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Labbini. All rights reserved. Built with ❤️ for Lebanon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
