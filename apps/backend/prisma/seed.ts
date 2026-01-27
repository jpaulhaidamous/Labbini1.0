import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Categories
  console.log('Creating categories...');

  const digitalCreative = await prisma.category.create({
    data: {
      nameEn: 'Digital & Creative',
      nameAr: 'خدمات رقمية وإبداعية',
      slug: 'digital-creative',
      icon: '💻',
      sortOrder: 1,
    },
  });

  const professionalServices = await prisma.category.create({
    data: {
      nameEn: 'Professional Services',
      nameAr: 'خدمات مهنية',
      slug: 'professional-services',
      icon: '💼',
      sortOrder: 2,
    },
  });

  const manualTrades = await prisma.category.create({
    data: {
      nameEn: 'Manual Trades',
      nameAr: 'الحرف اليدوية',
      slug: 'manual-trades',
      icon: '🔧',
      sortOrder: 3,
    },
  });

  const eventsPersonal = await prisma.category.create({
    data: {
      nameEn: 'Events & Personal',
      nameAr: 'فعاليات وخدمات شخصية',
      slug: 'events-personal',
      icon: '🎉',
      sortOrder: 4,
    },
  });

  // Digital & Creative Subcategories
  const webDev = await prisma.category.create({
    data: {
      nameEn: 'Web Development',
      nameAr: 'تطوير المواقع',
      slug: 'web-development',
      parentId: digitalCreative.id,
      sortOrder: 1,
    },
  });

  const mobileDev = await prisma.category.create({
    data: {
      nameEn: 'Mobile Development',
      nameAr: 'تطوير التطبيقات',
      slug: 'mobile-development',
      parentId: digitalCreative.id,
      sortOrder: 2,
    },
  });

  const graphicDesign = await prisma.category.create({
    data: {
      nameEn: 'Graphic Design',
      nameAr: 'التصميم الجرافيكي',
      slug: 'graphic-design',
      parentId: digitalCreative.id,
      sortOrder: 3,
    },
  });

  const videoAnimation = await prisma.category.create({
    data: {
      nameEn: 'Video & Animation',
      nameAr: 'فيديو ورسوم متحركة',
      slug: 'video-animation',
      parentId: digitalCreative.id,
      sortOrder: 4,
    },
  });

  const writingTranslation = await prisma.category.create({
    data: {
      nameEn: 'Writing & Translation',
      nameAr: 'كتابة وترجمة',
      slug: 'writing-translation',
      parentId: digitalCreative.id,
      sortOrder: 5,
    },
  });

  const digitalMarketing = await prisma.category.create({
    data: {
      nameEn: 'Digital Marketing',
      nameAr: 'تسويق رقمي',
      slug: 'digital-marketing',
      parentId: digitalCreative.id,
      sortOrder: 6,
    },
  });

  // Professional Services Subcategories
  const accounting = await prisma.category.create({
    data: {
      nameEn: 'Accounting & Finance',
      nameAr: 'محاسبة ومالية',
      slug: 'accounting-finance',
      parentId: professionalServices.id,
      sortOrder: 1,
    },
  });

  const legalServices = await prisma.category.create({
    data: {
      nameEn: 'Legal Services',
      nameAr: 'خدمات قانونية',
      slug: 'legal-services',
      parentId: professionalServices.id,
      sortOrder: 2,
    },
  });

  const teaching = await prisma.category.create({
    data: {
      nameEn: 'Teaching & Tutoring',
      nameAr: 'تدريس وتعليم',
      slug: 'teaching-tutoring',
      parentId: professionalServices.id,
      sortOrder: 3,
    },
  });

  // Manual Trades Subcategories
  const plumbing = await prisma.category.create({
    data: {
      nameEn: 'Plumbing',
      nameAr: 'سباكة',
      slug: 'plumbing',
      parentId: manualTrades.id,
      sortOrder: 1,
    },
  });

  const electrical = await prisma.category.create({
    data: {
      nameEn: 'Electrical',
      nameAr: 'كهرباء',
      slug: 'electrical',
      parentId: manualTrades.id,
      sortOrder: 2,
    },
  });

  const carpentry = await prisma.category.create({
    data: {
      nameEn: 'Carpentry',
      nameAr: 'نجارة',
      slug: 'carpentry',
      parentId: manualTrades.id,
      sortOrder: 3,
    },
  });

  const painting = await prisma.category.create({
    data: {
      nameEn: 'Painting',
      nameAr: 'دهان',
      slug: 'painting',
      parentId: manualTrades.id,
      sortOrder: 4,
    },
  });

  const hvac = await prisma.category.create({
    data: {
      nameEn: 'HVAC / AC Repair',
      nameAr: 'تكييف وتبريد',
      slug: 'hvac-ac-repair',
      parentId: manualTrades.id,
      sortOrder: 5,
    },
  });

  const cleaning = await prisma.category.create({
    data: {
      nameEn: 'Cleaning Services',
      nameAr: 'تنظيف',
      slug: 'cleaning-services',
      parentId: manualTrades.id,
      sortOrder: 6,
    },
  });

  // Events & Personal Subcategories
  const catering = await prisma.category.create({
    data: {
      nameEn: 'Catering',
      nameAr: 'تموين وتقديم طعام',
      slug: 'catering',
      parentId: eventsPersonal.id,
      sortOrder: 1,
    },
  });

  const eventPlanning = await prisma.category.create({
    data: {
      nameEn: 'Event Planning',
      nameAr: 'تنظيم فعاليات',
      slug: 'event-planning',
      parentId: eventsPersonal.id,
      sortOrder: 2,
    },
  });

  console.log('✅ Categories created');

  // Create Skills
  console.log('Creating skills...');

  const webDevSkills = [
    { en: 'React.js', ar: 'React.js' },
    { en: 'Vue.js', ar: 'Vue.js' },
    { en: 'Angular', ar: 'Angular' },
    { en: 'Node.js', ar: 'Node.js' },
    { en: 'PHP', ar: 'PHP' },
    { en: 'Laravel', ar: 'Laravel' },
    { en: 'WordPress', ar: 'WordPress' },
    { en: 'HTML/CSS', ar: 'HTML/CSS' },
  ];

  for (const skill of webDevSkills) {
    await prisma.skill.create({
      data: {
        nameEn: skill.en,
        nameAr: skill.ar,
        slug: skill.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId: webDev.id,
      },
    });
  }

  const mobileDevSkills = [
    { en: 'React Native', ar: 'React Native' },
    { en: 'Flutter', ar: 'Flutter' },
    { en: 'iOS Development', ar: 'تطوير iOS' },
    { en: 'Android Development', ar: 'تطوير Android' },
  ];

  for (const skill of mobileDevSkills) {
    await prisma.skill.create({
      data: {
        nameEn: skill.en,
        nameAr: skill.ar,
        slug: skill.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId: mobileDev.id,
      },
    });
  }

  const graphicDesignSkills = [
    { en: 'Adobe Photoshop', ar: 'فوتوشوب' },
    { en: 'Adobe Illustrator', ar: 'اليستريتور' },
    { en: 'Figma', ar: 'Figma' },
    { en: 'Logo Design', ar: 'تصميم شعارات' },
    { en: 'Branding', ar: 'تصميم هوية' },
  ];

  for (const skill of graphicDesignSkills) {
    await prisma.skill.create({
      data: {
        nameEn: skill.en,
        nameAr: skill.ar,
        slug: skill.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId: graphicDesign.id,
      },
    });
  }

  const writingSkills = [
    { en: 'Content Writing', ar: 'كتابة محتوى' },
    { en: 'Copywriting', ar: 'كتابة إعلانية' },
    { en: 'Translation (Arabic-English)', ar: 'ترجمة (عربي-إنجليزي)' },
    { en: 'Proofreading', ar: 'تدقيق لغوي' },
  ];

  for (const skill of writingSkills) {
    await prisma.skill.create({
      data: {
        nameEn: skill.en,
        nameAr: skill.ar,
        slug: skill.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId: writingTranslation.id,
      },
    });
  }

  const digitalMarketingSkills = [
    { en: 'Social Media Marketing', ar: 'تسويق عبر السوشيال ميديا' },
    { en: 'SEO', ar: 'تحسين محركات البحث' },
    { en: 'Google Ads', ar: 'إعلانات جوجل' },
    { en: 'Facebook Ads', ar: 'إعلانات فيسبوك' },
  ];

  for (const skill of digitalMarketingSkills) {
    await prisma.skill.create({
      data: {
        nameEn: skill.en,
        nameAr: skill.ar,
        slug: skill.en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId: digitalMarketing.id,
      },
    });
  }

  console.log('✅ Skills created');

  // Create Test Users
  console.log('Creating test users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Test Client
  const testClient = await prisma.user.create({
    data: {
      email: 'client@labbini.com',
      phone: '+96170123456',
      passwordHash: hashedPassword,
      role: 'CLIENT',
      verificationLevel: 'LEVEL_1',
      emailVerified: true,
      phoneVerified: true,
      profile: {
        create: {
          displayNameEn: 'Ahmad Khalil',
          displayNameAr: 'أحمد خليل',
          governorate: 'Beirut',
          city: 'Beirut',
        },
      },
      wallet: {
        create: {
          availableBalance: 1000,
        },
      },
    },
  });

  // Test Freelancer 1 - Web Developer
  const freelancer1 = await prisma.user.create({
    data: {
      email: 'freelancer1@labbini.com',
      phone: '+96171234567',
      passwordHash: hashedPassword,
      role: 'FREELANCER',
      verificationLevel: 'LEVEL_2',
      emailVerified: true,
      phoneVerified: true,
      profile: {
        create: {
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
      },
      wallet: {
        create: {
          availableBalance: 450,
          totalEarned: 12500,
          totalWithdrawn: 12050,
        },
      },
    },
  });

  // Add skills to freelancer 1
  const reactSkill = await prisma.skill.findFirst({ where: { slug: 'react-js' } });
  const nodeSkill = await prisma.skill.findFirst({ where: { slug: 'node-js' } });

  if (reactSkill && nodeSkill && freelancer1.profile) {
    const profile1 = await prisma.profile.findUnique({ where: { userId: freelancer1.id } });
    if (profile1) {
      await prisma.profileSkill.createMany({
        data: [
          { profileId: profile1.id, skillId: reactSkill.id },
          { profileId: profile1.id, skillId: nodeSkill.id },
        ],
      });
    }
  }

  // Test Freelancer 2 - Plumber
  const freelancer2 = await prisma.user.create({
    data: {
      email: 'freelancer2@labbini.com',
      phone: '+96176543210',
      passwordHash: hashedPassword,
      role: 'FREELANCER',
      verificationLevel: 'LEVEL_2',
      emailVerified: true,
      phoneVerified: true,
      profile: {
        create: {
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
      },
      wallet: {
        create: {
          availableBalance: 320,
          totalEarned: 8900,
          totalWithdrawn: 8580,
        },
      },
    },
  });

  // Test Freelancer 3 - Graphic Designer
  const freelancer3 = await prisma.user.create({
    data: {
      email: 'freelancer3@labbini.com',
      phone: '+96178987654',
      passwordHash: hashedPassword,
      role: 'FREELANCER',
      verificationLevel: 'LEVEL_1',
      emailVerified: true,
      phoneVerified: true,
      profile: {
        create: {
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
      },
      wallet: {
        create: {
          availableBalance: 200,
          totalEarned: 5400,
          totalWithdrawn: 5200,
        },
      },
    },
  });

  // Add skills to freelancer 3
  const photoshopSkill = await prisma.skill.findFirst({ where: { slug: 'adobe-photoshop' } });
  const illustratorSkill = await prisma.skill.findFirst({ where: { slug: 'adobe-illustrator' } });

  if (photoshopSkill && illustratorSkill) {
    const profile3 = await prisma.profile.findUnique({ where: { userId: freelancer3.id } });
    if (profile3) {
      await prisma.profileSkill.createMany({
        data: [
          { profileId: profile3.id, skillId: photoshopSkill.id },
          { profileId: profile3.id, skillId: illustratorSkill.id },
        ],
      });
    }
  }

  console.log('✅ Test users created');

  // Create Sample Job
  console.log('Creating sample job...');

  const sampleJob = await prisma.job.create({
    data: {
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
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      isUrgent: false,
      visibility: 'PUBLIC',
      status: 'OPEN',
    },
  });

  console.log('✅ Sample job created');

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
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
