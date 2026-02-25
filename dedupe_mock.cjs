const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'data', 'mockData.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Deduplicating keys...");

content = content.replace(/\{[\s\S]*?\}/g, (match) => {
    const lines = match.split('\n');
    const seen = new Set();
    const result = [];

    for (let line of lines) {
        let keyMatch = line.match(/"(position|frpPosition)":/);
        if (keyMatch) {
            let key = keyMatch[1];
            if (seen.has(key)) {
                continue; // Skip duplicate
            }
            seen.add(key);
        }
        result.push(line);
    }
    return result.join('\n');
});

fs.writeFileSync(filePath, content, 'utf8');
console.log("Deduplication complete.");
