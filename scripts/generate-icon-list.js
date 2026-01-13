import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconDir = path.join(__dirname, '../public/icon');
const outputFile = path.join(__dirname, '../src/data/iconList.js');

try {
    const files = fs.readdirSync(iconDir);
    const iconFiles = files.filter(file => file.endsWith('.png')).sort();

    const fileContent = `export const ICON_LIST = [\n${iconFiles.map(file => `    "${file}"`).join(',\n')}\n];\n`;

    fs.writeFileSync(outputFile, fileContent);
    console.log(`Successfully generated iconList.js with ${iconFiles.length} icons.`);
} catch (err) {
    console.error('Error generating icon list:', err);
    process.exit(1);
}
