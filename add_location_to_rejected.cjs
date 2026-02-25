const fs = require('fs');
const path = require('path');

const filePath = 'd:\\Azv\\DataManagementInterface\\src\\app\\data\\mockData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find the mockRejectedData array
const startTag = 'export const mockRejectedData: RejectedRecord[] = [';
const startIndex = content.indexOf(startTag);

if (startIndex !== -1) {
    // Find the end of this array section
    let nextExportIndex = content.slice(startIndex + startTag.length).search(/export const/);
    let endIndex = nextExportIndex === -1 ? content.length : startIndex + startTag.length + nextExportIndex;

    let section = content.slice(startIndex, endIndex);

    // For each object in the array, add "location": "" if it doesn't exist
    // Objects are delimited by { ... }
    const updatedSection = section.replace(/\{[^{}]*\}/g, (match) => {
        if (!match.includes('"location"')) {
            // Find the last property before closing brace
            // Usually it's "rejectedDate": "..."
            // We'll insert it before the closing brace
            return match.replace(/\s*\}\s*$/, ',\n    "location": ""\n  }');
        }
        return match;
    });

    content = content.slice(0, startIndex) + updatedSection + content.slice(endIndex);
    fs.writeFileSync(filePath, content);
    console.log('Successfully added location to rejected items');
} else {
    console.log('Could not find mockRejectedData');
}
