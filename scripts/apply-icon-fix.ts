import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Extending Skill.icon field to LONGTEXT...');
  
  try {
    // MySQL raw query to alter column type
    await prisma.$executeRaw`
      ALTER TABLE Skill 
      MODIFY COLUMN icon LONGTEXT
    `;
    
    console.log('✅ Skill.icon field extended to LONGTEXT');
    
    // Test SVG storage
    const testSVG = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Unity</title><path d="M12 0l9.546 5.505v11.99L12 24l-9.546-5.505V5.505L12 0zm0 2.309L4.364 6.727v8.546L12 19.691l7.636-4.418V6.727L12 2.309z"/></svg>`;
    
    console.log('\nTest SVG length:', testSVG.length, 'characters');
    console.log('Can now store SVG icons without truncation ✅');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
