import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Find or create test user
  let user = await prisma.user.findUnique({
    where: { email: 'danny@test.com' },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'danny@test.com',
        username: 'danny',
        password: await hashPassword('testpass123'),
      },
    });
    console.log('✅ Created test user: danny@test.com');
  } else {
    console.log('✅ Using existing user: danny@test.com');
  }

  // Delete existing entries for clean slate
  const deleted = await prisma.coffeeEntry.deleteMany({
    where: { userId: user.id },
  });
  console.log(`🗑️  Deleted ${deleted.count} existing entries`);

  // Create coffee entries for the last 30 days
  const coffeeTypes = ['LATTE', 'ESPRESSO', 'AMERICANO', 'COLD_BREW', 'CAPPUCCINO', 'DRIP_COFFEE'] as const;
  const sizes = ['SMALL', 'MEDIUM', 'LARGE'] as const;
  const caffeineLookup: Record<string, Record<string, number>> = {
    LATTE: { SMALL: 75, MEDIUM: 150, LARGE: 225 },
    ESPRESSO: { SMALL: 64, MEDIUM: 128, LARGE: 192 },
    AMERICANO: { SMALL: 77, MEDIUM: 154, LARGE: 231 },
    COLD_BREW: { SMALL: 150, MEDIUM: 200, LARGE: 300 },
    CAPPUCCINO: { SMALL: 75, MEDIUM: 150, LARGE: 225 },
    DRIP_COFFEE: { SMALL: 95, MEDIUM: 140, LARGE: 210 },
  };

  const entries = [];
  const now = new Date();

  // Create varying amounts of coffee per day
  for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
    const date = new Date(now);
    date.setDate(now.getDate() - daysAgo);

    // Random number of coffees per day (0-4)
    const coffeesPerDay = Math.floor(Math.random() * 5);

    for (let i = 0; i < coffeesPerDay; i++) {
      const type = coffeeTypes[Math.floor(Math.random() * coffeeTypes.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const caffeine = caffeineLookup[type][size];

      // Random time during the day
      const hour = 6 + Math.floor(Math.random() * 16); // Between 6 AM and 10 PM
      const minute = Math.floor(Math.random() * 60);

      const consumedAt = new Date(date);
      consumedAt.setHours(hour, minute, 0, 0);

      entries.push({
        userId: user.id,
        type,
        size,
        caffeine,
        consumedAt,
        notes: i === 0 ? 'Morning coffee' : i === coffeesPerDay - 1 ? 'Evening coffee' : undefined,
      });
    }
  }

  // Create entries
  await prisma.coffeeEntry.createMany({
    data: entries,
  });

  console.log(`✅ Created ${entries.length} coffee entries over the last 30 days`);

  // Calculate stats
  const totalCaffeine = entries.reduce((sum, e) => sum + e.caffeine, 0);
  const avgPerDay = (entries.length / 30).toFixed(1);
  const avgCaffeinePerDay = (totalCaffeine / 30).toFixed(0);

  console.log('\n📊 Summary:');
  console.log(`   Total entries: ${entries.length}`);
  console.log(`   Average per day: ${avgPerDay}`);
  console.log(`   Total caffeine: ${totalCaffeine}mg`);
  console.log(`   Average caffeine/day: ${avgCaffeinePerDay}mg`);
  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
