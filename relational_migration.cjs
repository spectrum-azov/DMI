const fs = require('fs');

const filePath = 'd:\\Azv\\DataManagementInterface\\src\\app\\data\\mockData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Helper to extract directory items and build maps
function getDirMap(arrayName) {
    const startTag = `export const ${arrayName}: DirectoryItem[] = [`;
    const startIndex = content.indexOf(startTag);
    if (startIndex === -1) return { map: {}, list: [], nextId: 1 };

    let endIndex = content.indexOf('];', startIndex);
    if (endIndex === -1) endIndex = content.length;

    const section = content.slice(startIndex + startTag.length, endIndex);
    const items = [];
    const map = {};
    let maxId = 0;

    // Simple regex to parse { id: N, name: "S" }
    const regex = /\{\s*"id":\s*(\d+),\s*"name":\s*"([^"]*)"\s*\}/g;
    let match;
    while ((match = regex.exec(section)) !== null) {
        const id = parseInt(match[1]);
        const name = match[2];
        items.push({ id, name });
        map[name] = id;
        if (id > maxId) maxId = id;
    }

    return { map, list: items, nextId: maxId + 1, start: startIndex, end: endIndex + 2, tagName: arrayName };
}

const dirs = {
    nomenclature: getDirMap('mockNomenclatures'),
    type: getDirMap('mockTypes'),
    department: getDirMap('mockDepartments'),
    location: getDirMap('mockLocations')
};

// Also positions just in case, though prompt didn't ask to replace them in records
const positions = getDirMap('mockPositions');

function getOrAdd(dirKey, name) {
    const dir = dirs[dirKey];
    if (dir.map[name] !== undefined) return dir.map[name];

    const newId = dir.nextId++;
    dir.map[name] = newId;
    dir.list.push({ id: newId, name });
    return newId;
}

// Function to process a data section
function processDataSection(tagName) {
    const startTag = `export const ${tagName}:`;
    const startIndex = content.indexOf(startTag);
    if (startIndex === -1) return;

    let nextExportIndex = content.slice(startIndex + startTag.length).search(/export const/);
    let endIndex = nextExportIndex === -1 ? content.length : startIndex + startTag.length + nextExportIndex;

    let section = content.slice(startIndex, endIndex);

    // Replace "nomenclature": "String" with "nomenclature": ID
    // We do this for the 4 fields
    for (const field of ['nomenclature', 'type', 'department', 'location']) {
        const fieldRegex = new RegExp(`"${field}":\\s*"([^"]*)"`, 'g');
        section = section.replace(fieldRegex, (match, val) => {
            const id = getOrAdd(field, val);
            return `"${field}": ${id}`;
        });
    }

    content = content.slice(0, startIndex) + section + content.slice(endIndex);
}

processDataSection('mockIssuanceData');
processDataSection('mockNeedsData');
processDataSection('mockRejectedData');

// Now update the directory sections in the content
for (const key in dirs) {
    const dir = dirs[key];
    let newDirContent = `export const ${dir.tagName}: DirectoryItem[] = [\n`;
    dir.list.forEach((item, index) => {
        newDirContent += `  {\n    "id": ${item.id},\n    "name": "${item.name.replace(/"/g, '\\"')}"\n  }${index === dir.list.length - 1 ? '' : ','}\n`;
    });
    newDirContent += `];`;

    // Since processDataSection might have moved things, we need to find the dir tags again or update them carefully.
    // Actually, I'll just find them by name again.
    const startTag = `export const ${dir.tagName}: DirectoryItem[] = [`;
    const currentStart = content.indexOf(startTag);
    const currentEnd = content.indexOf('];', currentStart) + 2;

    content = content.slice(0, currentStart) + newDirContent + content.slice(currentEnd);
}

fs.writeFileSync(filePath, content);
console.log('Successfully migrated mock data to relational structure.');
