import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking last 5 skills in database...\n');
  
  const skills = await prisma.skill.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log('Total skills:', await prisma.skill.count());
  console.log('\nLast 5 skills:');
  
  skills.forEach((skill, i) => {
    console.log(`\n${i + 1}. ${skill.name}`);
    console.log(`   Category: ${skill.category}`);
    console.log(`   Visible: ${skill.visible}`);
    console.log(`   Icon: ${skill.icon ? (skill.icon.substring(0, 50) + '...') : 'null'}`);
    console.log(`   Created: ${skill.createdAt}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
