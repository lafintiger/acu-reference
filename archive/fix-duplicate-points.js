// Quick script to find and fix duplicate point IDs
const fs = require('fs');

console.log('🔍 Checking for duplicate point IDs...');

try {
  const seedData = fs.readFileSync('src/data/seedData.ts', 'utf8');
  
  // Extract all point IDs
  const idMatches = seedData.match(/id: '[^']+'/g);
  const ids = idMatches ? idMatches.map(match => match.replace(/id: '([^']+)'/, '$1')) : [];
  
  console.log(`📊 Total point IDs found: ${ids.length}`);
  
  // Find duplicates
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  const uniqueDuplicates = [...new Set(duplicates)];
  
  console.log(`❌ Duplicate IDs found: ${uniqueDuplicates.length}`);
  uniqueDuplicates.forEach(id => {
    const count = ids.filter(i => i === id).length;
    console.log(`  - ${id}: ${count} occurrences`);
  });
  
  if (uniqueDuplicates.length === 0) {
    console.log('✅ No duplicates found!');
  }
  
} catch (error) {
  console.error('❌ Error checking duplicates:', error);
}

console.log('🔍 Check complete');
