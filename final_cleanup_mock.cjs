const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'data', 'mockData.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Starting final cleanup of mockData.ts...");

// 1. Fix the comma formatting (move comma to end of previous line)
content = content.replace(/\n\s*,\s*\n\s*/g, ',\n    ');

// 2. Process each object to deduplicate keys and ensure required fields
content = content.replace(/\{[\s\S]*?\}/g, (match) => {
    // Skip imports and array declarations
    if (match.includes('import ') || match.includes('export const')) return match;

    const lines = match.split('\n');
    const seen = new Set();
    const result = [];

    // Parse existing keys and keep track of their lines
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let keyMatch = line.match(/"([^"]+)":/);

        if (keyMatch) {
            let key = keyMatch[1];
            if (seen.has(key)) {
                // If it's a duplicate and the value is "Не вказано", skip it
                // Or if we already have a more "meaningful" value, keep the first one.
                // In our case, we usually want to keep the non-default one if possible,
                // but for simplicity, let's keep the FIRST occurrence.
                continue;
            }
            seen.add(key);
        }
        result.push(line);
    }

    // Ensure required fields if they weren't seen
    const required = {
        "mobileNumber": '""',
        "notes": '""',
        "position": '"Не вказано"',
        "quantity": '1'
    };

    // We'll insert before the closing brace
    let lastLine = result.pop();

    for (const [key, defValue] of Object.entries(required)) {
        if (!seen.has(key)) {
            // Add a comma to the previous line if it doesn't have one and isn't the opening brace
            if (result.length > 1) {
                let prevLine = result[result.length - 1].trim();
                if (!prevLine.endsWith(',') && !prevLine.endsWith('{')) {
                    result[result.length - 1] += ',';
                }
            }
            result.push(`    "${key}": ${defValue}`);
        }
    }

    result.push(lastLine);
    return result.join('\n');
});

// 3. Final cleanup for double commas or trailing commas before closing brace
content = content.replace(/,\s*,\s*/g, ',\n    ');
content = content.replace(/,\s*\}/g, '\n  }');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Final cleanup complete.");
