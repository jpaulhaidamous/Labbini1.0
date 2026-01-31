import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Fixed UUIDs for idempotent job seeding
const JOB_UUID_1 = '11111111-1111-1111-1111-111111111111';
const JOB_UUID_2 = '22222222-2222-2222-2222-222222222222';
const JOB_UUID_3 = '33333333-3333-3333-3333-333333333333';

async function main() {
  console.log('🌱 Starting database seed...');

  // ========== CREATE CATEGORIES ==========
  console.log('Upserting categories...');

  // Root Categories
  const digitalCreative = await prisma.category.upsert({
    where: { slug: 'digital-creative' },
    update: {},
    create: {
      nameEn: 'Digital & Creative',
      nameAr: 'خدمات رقمية وإبداعية',
      slug: 'digital-creative',
      icon: '💻',
      sortOrder: 1,
    },
  });

  const professionalServices = await prisma.category.upsert({
    where: { slug: 'professional-services' },
    update: {},
    create: {
      nameEn: 'Professional Services',
      nameAr: 'خدمات مهنية',
      slug: 'professional-services',
      icon: '💼',
      sortOrder: 2,
    },
  });

  const manualTrades = await prisma.category.upsert({
    where: { slug: 'manual-trades' },
    update: {},
    create: {
      nameEn: 'Manual Trades',
      nameAr: 'الحرف اليدوية',
      slug: 'manual-trades',
      icon: '🔧',
      sortOrder: 3,
    },
  });

  const eventsPersonal = await prisma.category.upsert({
    where: { slug: 'events-personal' },
    update: {},
    create: {
      nameEn: 'Events & Personal',
      nameAr: 'فعاليات وخدمات شخصية',
      slug: 'events-personal',
      icon: '🎉',
      sortOrder: 4,
    },
  });

  // Digital & Creative Subcategories
  const webDev = await prisma.category.upsert({
    where: { slug: 'web-development' },
    update: {},
    create: {
      nameEn: 'Web Development',
      nameAr: 'تطوير المواقع',
      slug: 'web-development',
      parentId: digitalCreative.id,
      sortOrder: 1,
    },
  });

  const mobileDev = await prisma.category.upsert({
    where: { slug: 'mobile-development' },
    update: {},
    create: {
      nameEn: 'Mobile Development',
      nameAr: 'تطوير التطبيقات',
      slug: 'mobile-development',
      parentId: digitalCreative.id,
      sortOrder: 2,
    },
  });

  const graphicDesign = await prisma.category.upsert({
    where: { slug: 'graphic-design' },
    update: {},
    create: {
      nameEn: 'Graphic Design',
      nameAr: 'التصميم الجرافيكي',
      slug: 'graphic-design',
      parentId: digitalCreative.id,
      sortOrder: 3,
    },
  });

  const videoAnimation = await prisma.category.upsert({
    where: { slug: 'video-animation' },
    update: {},
    create: {
      nameEn: 'Video & Animation',
      nameAr: 'فيديو ورسوم متحركة',
      slug: 'video-animation',
      parentId: digitalCreative.id,
      sortOrder: 4,
    },
  });

  const writingTranslation = await prisma.category.upsert({
    where: { slug: 'writing-translation' },
    update: {},
    create: {
      nameEn: 'Writing & Translation',
      nameAr: 'كتابة وترجمة',
      slug: 'writing-translation',
      parentId: digitalCreative.id,
      sortOrder: 5,
    },
  });

  const digitalMarketing = await prisma.category.upsert({
    where: { slug: 'digital-marketing' },
    update: {},
    create: {
      nameEn: 'Digital Marketing',
      nameAr: 'تسويق رقمي',
      slug: 'digital-marketing',
      parentId: digitalCreative.id,
      sortOrder: 6,
    },
  });

  // Professional Services Subcategories
  const accounting = await prisma.category.upsert({
    where: { slug: 'accounting-finance' },
    update: {},
    create: {
      nameEn: 'Accounting & Finance',
      nameAr: 'محاسبة ومالية',
      slug: 'accounting-finance',
      parentId: professionalServices.id,
      sortOrder: 1,
    },
  });

  const legalServices = await prisma.category.upsert({
    where: { slug: 'legal-services' },
    update: {},
    create: {
      nameEn: 'Legal Services',
      nameAr: 'خدمات قانونية',
      slug: 'legal-services',
      parentId: professionalServices.id,
      sortOrder: 2,
    },
  });

  const teaching = await prisma.category.upsert({
    where: { slug: 'teaching-tutoring' },
    update: {},
    create: {
      nameEn: 'Teaching & Tutoring',
      nameAr: 'تدريس وتعليم',
      slug: 'teaching-tutoring',
      parentId: professionalServices.id,
      sortOrder: 3,
    },
  });

  // Manual Trades Subcategories
  const plumbing = await prisma.category.upsert({
    where: { slug: 'plumbing' },
    update: {},
    create: {
      nameEn: 'Plumbing',
      nameAr: 'سباكة',
      slug: 'plumbing',
      parentId: manualTrades.id,
      sortOrder: 1,
    },
  });

  const electrical = await prisma.category.upsert({
    where: { slug: 'electrical' },
    update: {},
    create: {
      nameEn: 'Electrical',
      nameAr: 'كهرباء',
      slug: 'electrical',
      parentId: manualTrades.id,
      sortOrder: 2,
    },
  });

  const carpentry = await prisma.category.upsert({
    where: { slug: 'carpentry' },
    update: {},
    create: {
      nameEn: 'Carpentry',
      nameAr: 'نجارة',
      slug: 'carpentry',
      parentId: manualTrades.id,
      sortOrder: 3,
    },
  });

  const painting = await prisma.category.upsert({
    where: { slug: 'painting' },
    update: {},
    create: {
      nameEn: 'Painting',
      nameAr: 'دهان',
      slug: 'painting',
      parentId: manualTrades.id,
      sortOrder: 4,
    },
  });

  const hvac = await prisma.category.upsert({
    where: { slug: 'hvac-ac-repair' },
    update: {},
    create: {
      nameEn: 'HVAC / AC Repair',
      nameAr: 'تكييف وتبريد',
      slug: 'hvac-ac-repair',
      parentId: manualTrades.id,
      sortOrder: 5,
    },
  });

  const cleaning = await prisma.category.upsert({
    where: { slug: 'cleaning-services' },
    update: {},
    create: {
      nameEn: 'Cleaning Services',
      nameAr: 'تنظيف',
      slug: 'cleaning-services',
      parentId: manualTrades.id,
      sortOrder: 6,
    },
  });

  // Events & Personal Subcategories
  const catering = await prisma.category.upsert({
    where: { slug: 'catering' },
    update: {},
    create: {
      nameEn: 'Catering',
      nameAr: 'تموين وتقديم طعام',
      slug: 'catering',
      parentId: eventsPersonal.id,
      sortOrder: 1,
    },
  });

  const eventPlanning = await prisma.category.upsert({
    where: { slug: 'event-planning' },
    update: {},
    create: {
      nameEn: 'Event Planning',
      nameAr: 'تنظيم فعاليات',
      slug: 'event-planning',
      parentId: eventsPersonal.id,
      sortOrder: 2,
    },
  });

  console.log('✅ Categories upserted');

  // ========== CREATE SKILLS ==========
  console.log('Upserting skills...');

  const skillsData = [
    // Web Development
    { en: 'React.js', ar: 'React.js', categoryId: webDev.id },
    { en: 'Vue.js', ar: 'Vue.js', categoryId: webDev.id },
    { en: 'Angular', ar: 'Angular', categoryId: webDev.id },
    { en: 'Node.js', ar: 'Node.js', categoryId: webDev.id },
    { en: 'PHP', ar: 'PHP', categoryId: webDev.id },
    { en: 'Laravel', ar: 'Laravel', categoryId: webDev.id },
    { en: 'WordPress', ar: 'WordPress', categoryId: webDev.id },
    { en: 'HTML/CSS', ar: 'HTML/CSS', categoryId: webDev.id },
    // Mobile Development
    { en: 'React Native', ar: 'React Native', categoryId: mobileDev.id },
    { en: 'Flutter', ar: 'Flutter', categoryId: mobileDev.id },
    { en: 'iOS Development', ar: 'تطوير iOS', categoryId: mobileDev.id },
    { en: 'Android Development', ar: 'تطوير Android', categoryId: mobileDev.id },
    // Graphic Design
    { en: 'Adobe Photoshop', ar: 'فوتوشوب', categoryId: graphicDesign.id },
    { en: 'Adobe Illustrator', ar: 'اليستريتور', categoryId: graphicDesign.id },
    { en: 'Figma', ar: 'Figma', categoryId: graphicDesign.id },
    { en: 'Logo Design', ar: 'تصميم شعارات', categoryId: graphicDesign.id },
    { en: 'Branding', ar: 'تصميم هوية', categoryId: graphicDesign.id },
    // Writing & Translation
    { en: 'Content Writing', ar: 'كتابة محتوى', categoryId: writingTranslation.id },
    { en: 'Copywriting', ar: 'كتابة إعلانية', categoryId: writingTranslation.id },
    { en: 'Translation (Arabic-English)', ar: 'ترجمة (عربي-إنجليزي)', categoryId: writingTranslation.id },
    { en: 'Proofreading', ar: 'تدقيق لغوي', categoryId: writingTranslation.id },
    // Digital Marketing
    { en: 'Social Media Marketing', ar: 'تسويق عبر السوشيال ميديا', categoryId: digitalMarketing.id },
    { en: 'SEO', ar: 'تحسين محركات البحث', categoryId: digitalMarketing.id },
    { en: 'Google Ads', ar: 'إعلانات جوجل', categoryId: digitalMarketing.id },
    { en: 'Facebook Ads', ar: 'إعلانات فيسبوك', categoryId: digitalMarketing.id },
  ];

  for (const skill of skillsData) {
    const slug = skill.en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await prisma.skill.upsert({
      where: { slug },
      update: {},
      create: {
        nameEn: skill.en,
        nameAr: skill.ar,
        slug,
        categoryId: skill.categoryId,
      },
    });
  }

  console.log('✅ Skills upserted');

  // ========== CREATE TEST USERS ==========
  console.log('Upserting test users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Test Client
  const testClient = await prisma.user.upsert({
    where: { email: 'client@labbini.com' },
    update: {},
    create: {
      email: 'client@labbini.com',
      phone: '+96170123456',
      passwordHash: hashedPassword,
      role: 'CLIENT',
      verificationLevel: 'LEVEL_1',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // Upsert client profile
  await prisma.profile.upsert({
    where: { userId: testClient.id },
    update: {},
    create: {
      userId: testClient.id,
      displayNameEn: 'Ahmad Khalil',
      displayNameAr: 'أحمد خليل',
      governorate: 'Beirut',
      city: 'Beirut',
    },
  });

  // Upsert client wallet
  await prisma.wallet.upsert({
    where: { userId: testClient.id },
    update: {},
    create: {
      userId: testClient.id,
      availableBalance: 1000,
    },
  });

  // Test Freelancer 1 - Web Developer
  const freelancer1 = await prisma.user.upsert({
    where: { email: 'freelancer1@labbini.com' },
    update: {},
    create: {
      email: 'freelancer1@labbini.com',
      phone: '+96171234567',
      passwordHash: hashedPassword,
      role: 'FREELANCER',
      verificationLevel: 'LEVEL_2',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  const freelancer1Profile = await prisma.profile.upsert({
    where: { userId: freelancer1.id },
    update: {},
    create: {
      userId: freelancer1.id,
      displayNameEn: 'Sara Mansour',
      displayNameAr: 'سارة منصور',
      bioEn: 'Full-stack web developer with 5 years of experience specializing in React and Node.js',
      bioAr: 'مطورة مواقع متكاملة مع 5 سنوات خبرة متخصصة في React و Node.js',
      governorate: 'Mount Lebanon',
      city: 'Jounieh',
      hourlyRate: 25,
      isAvailable: true,
      jobSuccessScore: 95,
      totalEarned: 12500,
      totalJobsCompleted: 42,
      languages: ['Arabic', 'English', 'French'],
      responseTime: 2,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: freelancer1.id },
    update: {},
    create: {
      userId: freelancer1.id,
      availableBalance: 450,
      totalEarned: 12500,
      totalWithdrawn: 12050,
    },
  });

  // Add skills to freelancer 1
  const reactSkill = await prisma.skill.findFirst({ where: { slug: 'react-js' } });
  const nodeSkill = await prisma.skill.findFirst({ where: { slug: 'node-js' } });

  if (reactSkill) {
    await prisma.profileSkill.upsert({
      where: {
        profileId_skillId: {
          profileId: freelancer1Profile.id,
          skillId: reactSkill.id,
        },
      },
      update: {},
      create: {
        profileId: freelancer1Profile.id,
        skillId: reactSkill.id,
      },
    });
  }

  if (nodeSkill) {
    await prisma.profileSkill.upsert({
      where: {
        profileId_skillId: {
          profileId: freelancer1Profile.id,
          skillId: nodeSkill.id,
        },
      },
      update: {},
      create: {
        profileId: freelancer1Profile.id,
        skillId: nodeSkill.id,
      },
    });
  }

  // Test Freelancer 2 - Plumber
  const freelancer2 = await prisma.user.upsert({
    where: { email: 'freelancer2@labbini.com' },
    update: {},
    create: {
      email: 'freelancer2@labbini.com',
      phone: '+96176543210',
      passwordHash: hashedPassword,
      role: 'FREELANCER',
      verificationLevel: 'LEVEL_2',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  await prisma.profile.upsert({
    where: { userId: freelancer2.id },
    update: {},
    create: {
      userId: freelancer2.id,
      displayNameEn: 'Mahmoud Harb',
      displayNameAr: 'محمود حرب',
      bioEn: 'Professional plumber with 10 years of experience in residential and commercial projects',
      bioAr: 'سباك محترف مع 10 سنوات خبرة في المشاريع السكنية والتجارية',
      governorate: 'Beirut',
      city: 'Beirut',
      hourlyRate: 15,
      isAvailable: true,
      jobSuccessScore: 98,
      totalEarned: 8900,
      totalJobsCompleted: 156,
      languages: ['Arabic'],
      responseTime: 1,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: freelancer2.id },
    update: {},
    create: {
      userId: freelancer2.id,
      availableBalance: 320,
      totalEarned: 8900,
      totalWithdrawn: 8580,
    },
  });

  // Test Freelancer 3 - Graphic Designer
  const freelancer3 = await prisma.user.upsert({
    where: { email: 'freelancer3@labbini.com' },
    update: {},
    create: {
      email: 'freelancer3@labbini.com',
      phone: '+96178987654',
      passwordHash: hashedPassword,
      role: 'FREELANCER',
      verificationLevel: 'LEVEL_1',
      emailVerified: true,
      phoneVerified: true,
    },
  });

  const freelancer3Profile = await prisma.profile.upsert({
    where: { userId: freelancer3.id },
    update: {},
    create: {
      userId: freelancer3.id,
      displayNameEn: 'Lina Farah',
      displayNameAr: 'لينا فرح',
      bioEn: 'Creative graphic designer passionate about branding and visual identity',
      bioAr: 'مصممة جرافيك مبدعة شغوفة بالعلامات التجارية والهوية البصرية',
      governorate: 'North Lebanon',
      city: 'Tripoli',
      hourlyRate: 20,
      isAvailable: true,
      jobSuccessScore: 92,
      totalEarned: 5400,
      totalJobsCompleted: 28,
      languages: ['Arabic', 'English'],
      responseTime: 3,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: freelancer3.id },
    update: {},
    create: {
      userId: freelancer3.id,
      availableBalance: 200,
      totalEarned: 5400,
      totalWithdrawn: 5200,
    },
  });

  // Add skills to freelancer 3
  const photoshopSkill = await prisma.skill.findFirst({ where: { slug: 'adobe-photoshop' } });
  const illustratorSkill = await prisma.skill.findFirst({ where: { slug: 'adobe-illustrator' } });

  if (photoshopSkill) {
    await prisma.profileSkill.upsert({
      where: {
        profileId_skillId: {
          profileId: freelancer3Profile.id,
          skillId: photoshopSkill.id,
        },
      },
      update: {},
      create: {
        profileId: freelancer3Profile.id,
        skillId: photoshopSkill.id,
      },
    });
  }

  if (illustratorSkill) {
    await prisma.profileSkill.upsert({
      where: {
        profileId_skillId: {
          profileId: freelancer3Profile.id,
          skillId: illustratorSkill.id,
        },
      },
      update: {},
      create: {
        profileId: freelancer3Profile.id,
        skillId: illustratorSkill.id,
      },
    });
  }

  console.log('✅ Test users upserted');

  // ========== CREATE SAMPLE JOBS ==========
  console.log('Upserting sample jobs...');

  await prisma.job.upsert({
    where: { id: JOB_UUID_1 },
    update: {},
    create: {
      id: JOB_UUID_1,
      clientId: testClient.id,
      categoryId: webDev.id,
      titleEn: 'Build an E-commerce Website',
      titleAr: 'بناء موقع تجارة إلكترونية',
      descriptionEn:
        'Looking for an experienced web developer to build a modern e-commerce website for my business. The site should include product listings, shopping cart, checkout, and payment integration.',
      descriptionAr:
        'أبحث عن مطور مواقع ذو خبرة لبناء موقع تجارة إلكترونية حديث لأعمالي. يجب أن يتضمن الموقع قوائم المنتجات وسلة التسوق والدفع والتكامل مع بوابات الدفع.',
      jobType: 'FIXED',
      budgetType: 'RANGE',
      budgetMin: 1500,
      budgetMax: 3000,
      locationType: 'REMOTE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isUrgent: false,
      visibility: 'PUBLIC',
      status: 'OPEN',
    },
  });

  await prisma.job.upsert({
    where: { id: JOB_UUID_2 },
    update: {},
    create: {
      id: JOB_UUID_2,
      clientId: testClient.id,
      categoryId: graphicDesign.id,
      titleEn: 'Design Logo for Startup',
      titleAr: 'تصميم شعار لشركة ناشئة',
      descriptionEn:
        'Need a creative designer to create a modern logo for my tech startup. Should be minimalist and professional.',
      descriptionAr:
        'أحتاج مصمم مبدع لإنشاء شعار حديث لشركتي الناشئة التقنية. يجب أن يكون بسيطاً واحترافياً.',
      jobType: 'FIXED',
      budgetType: 'FIXED',
      budgetMin: 150,
      budgetMax: 150,
      locationType: 'REMOTE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      isUrgent: true,
      visibility: 'PUBLIC',
      status: 'OPEN',
    },
  });

  await prisma.job.upsert({
    where: { id: JOB_UUID_3 },
    update: {},
    create: {
      id: JOB_UUID_3,
      clientId: testClient.id,
      categoryId: plumbing.id,
      titleEn: 'Fix Kitchen Sink Leak',
      titleAr: 'إصلاح تسريب حوض المطبخ',
      descriptionEn:
        'Kitchen sink has a leak under the cabinet. Need a professional plumber to come fix it ASAP.',
      descriptionAr:
        'حوض المطبخ يوجد به تسريب تحت الخزانة. أحتاج سباك محترف لإصلاحه بأسرع وقت.',
      jobType: 'QUICK',
      budgetType: 'HOURLY',
      budgetMin: 15,
      budgetMax: 25,
      locationType: 'ONSITE',
      governorate: 'Beirut',
      city: 'Beirut',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isUrgent: true,
      visibility: 'PUBLIC',
      status: 'OPEN',
    },
  });

  console.log('✅ Sample jobs upserted');

  console.log('🎉 Seed completed successfully!');
  console.log('\nTest Accounts:');
  console.log('━'.repeat(50));
  console.log('Client:');
  console.log('  Email: client@labbini.com');
  console.log('  Password: password123');
  console.log('\nFreelancers:');
  console.log('  Email: freelancer1@labbini.com (Web Developer)');
  console.log('  Email: freelancer2@labbini.com (Plumber)');
  console.log('  Email: freelancer3@labbini.com (Graphic Designer)');
  console.log('  Password: password123 (for all)');
  console.log('━'.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
