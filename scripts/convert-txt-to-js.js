const fs = require('fs');
const path = require('path');

const booksDir = path.join(__dirname, '../assets/books');

// Read all .txt files in the books directory
const files = fs.readdirSync(booksDir).filter(file => file.endsWith('.txt'));

files.forEach(filename => {
  const txtPath = path.join(booksDir, filename);
  const jsPath = path.join(booksDir, filename.replace('.txt', '.js'));
  
  // Read the txt file content
  let content = fs.readFileSync(txtPath, 'utf-8');
  
  // Remove Project Gutenberg header
  content = content.replace(/\*\*\* START OF THE PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/g, '');
  content = content.replace(/\*\*\* END OF THE PROJECT GUTENBERG EBOOK[\s\S]*?$/g, '');
  
  // Remove [Illustration] markers
  content = content.replace(/\[Illustration\]/g, '');
  
  // Escape the content for JavaScript
  const escapedContent = content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/\n/g, '\\n');
  
  // Write as a JavaScript module
  const jsContent = `export default \`${escapedContent}\`;`;
  
  fs.writeFileSync(jsPath, jsContent, 'utf-8');
  console.log(`Converted ${filename} to ${filename.replace('.txt', '.js')}`);
});

console.log('Conversion complete!');
