const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'data', 'mockData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Helper to replace contactPerson with fullName
content = content.replace(/\"contactPerson\"/g, '\"fullName\"');

// Helper to fix objects
// We match objects that look like { ... }
// This is a bit fragile for TS but should work for the JSON-like data in mockData.ts
const objectRegex = /\{[^{}]+\}/g;

content = content.replace(objectRegex, (match) => {
    let objStr = match;

    // Add missing fields if they don't exist
    if (!objStr.includes('\"position\"')) {
        // Inject default position ID (e.g., 0 or from your directories)
        objStr = objStr.replace(/(\n\s+)(\"quantity\"|\"notes\")/, '$1\"position\": 0,$1$2');
    } else {
        // If position exists but is a string (e.g. from previous mock Data), convert to 0 for now
        // Or better, let's just make sure it's 0 if we can't map it safely
        objStr = objStr.replace(/(\"position\":\s*)\"[^\"]*\"/, '$1 0');
    }

    if (!objStr.includes('\"mobileNumber\"')) {
        objStr = objStr.replace(/(\n\s+)(\"quantity\"|\"notes\")/, '$1\"mobileNumber\": \"\",$1$2');
    }

    // Fix frpPosition if it's a string
    if (objStr.includes('\"frpPosition\"')) {
        objStr = objStr.replace(/(\"frpPosition\":\s*)\"[^\"]*\"/, '$1 0');
    }

    return objStr;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Mock data updated successfully.');
