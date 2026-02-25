const fs = require('fs');

const filePath = 'd:\\Azv\\DataManagementInterface\\src\\app\\data\\mockData.ts';
const content = fs.readFileSync(filePath, 'utf8');

function extractArray(name) {
    const startTag = `export const ${name}: any[] = [`;
    const startIndex = content.indexOf(startTag);
    if (startIndex === -1) {
        // Try without type annotation just in case
        const startTag2 = `export const ${name} = [`;
        const startIndex2 = content.indexOf(startTag2);
        if (startIndex2 === -1) return [];
        let nextExportIndex = content.slice(startIndex2 + startTag2.length).search(/export const/);
        let endIndex = nextExportIndex === -1 ? content.length : startIndex2 + startTag2.length + nextExportIndex;
        let jsonStr = content.slice(startIndex2 + startTag2.length, endIndex).trim();
        if (jsonStr.endsWith(';')) jsonStr = jsonStr.slice(0, -1);
        if (jsonStr.endsWith(']')) jsonStr = jsonStr; else jsonStr += ']';
        // Evaluation is risky but this is TS/JS. Let's try simple regex parsing since it's mock data.
        return [];
    }
}

// Since I can't easily parse TS exports as JSON, I'll use regex to collect all unique values
function getUniqueValues(fieldName) {
    const regex = new RegExp(`"${fieldName}":\\s*"([^"]*)"`, 'g');
    const values = new Set();
    let match;
    while ((match = regex.exec(content)) !== null) {
        values.add(match[1]);
    }
    return Array.from(values);
}

const fields = ['nomenclature', 'type', 'department', 'location'];
const report = {};
fields.forEach(f => {
    report[f] = getUniqueValues(f);
});

console.log(JSON.stringify(report, null, 2));
