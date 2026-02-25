const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'data', 'mockData.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Starting migration...");

// 1. Rename contactPerson to fullName
content = content.replace(/"contactPerson":/g, '"fullName":');

// 2. Rename 'request' field to 'applicationStatus' in issuance data
content = content.replace(/"request":/g, '"applicationStatus":');

// 3. Add default position if missing
// Find "fullName": "..." and if "position" is not present before "department", insert it.
// This regex looks for fullName line followed by some whitespace and then department.
// If it doesn't find position in between, it inserts it.
content = content.replace(/("fullName":\s*"[^"]*",\s*)((?!"position":)[\s\S]*?)("department":)/g, (match, p1, p2, p3) => {
    return p1 + p2 + '"position": "Не вказано",\n    ' + p3;
});

// Also handle the case where frpFullName is present but no frpPosition
content = content.replace(/("frpFullName":\s*"[^"]*",\s*)((?!"frpPosition":)[\s\S]*?)("frpRank":)/g, (match, p1, p2, p3) => {
    return p1 + p2 + '"frpPosition": "Не вказано",\n    ' + p3;
});

// 4. Fix empty or numeric positions to "Не вказано"
content = content.replace(/"position":\s*0/g, '"position": "Не вказано"');
content = content.replace(/"position":\s*""/g, '"position": "Не вказано"');
content = content.replace(/"frpPosition":\s*0/g, '"frpPosition": "Не вказано"');
content = content.replace(/"frpPosition":\s*""/g, '"frpPosition": "Не вказано"');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Mock data updated successfully.");
