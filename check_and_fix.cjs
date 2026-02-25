const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'data', 'mockData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Count object opens (excluding imports and array types)
const objectCount = (content.match(/\{/g) || []).length;
const mobileNumberCount = (content.match(/"mobileNumber":/g) || []).length;
const importBraces = (content.match(/import \{/g) || []).length + (content.match(/\} from/g) || []).length;

console.log(`Total braces: ${objectCount}`);
console.log(`Mobile numbers: ${mobileNumberCount}`);
console.log(`Import-related braces: ${importBraces}`);
console.log(`Estimated records: ${objectCount - (importBraces / 2)}`);

// Final fix for formatting
let fixed = content.replace(/\n\s*,\s*\n\s*/g, ',\n    ');
// Also fix any duplicate position or mobileNumber keys that might have slipped through
fixed = fixed.replace(/\{[\s\S]*?\}/g, (match) => {
    if (match.includes('import ') || match.includes('export const')) return match;
    const lines = match.split('\n');
    const seen = new Set();
    const result = [];
    for (let line of lines) {
        let keyMatch = line.match(/"([^"]+)":/);
        if (keyMatch) {
            let key = keyMatch[1];
            if (seen.has(key)) continue;
            seen.add(key);
        }
        result.push(line);
    }
    return result.join('\n');
});

fs.writeFileSync(filePath, fixed, 'utf8');
console.log("Formatting and duplicates fixed.");
