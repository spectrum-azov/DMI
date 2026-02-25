const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'data', 'mockData.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Adding missing required fields to mockData...");

// Helper function to add key-value pair if not present
function ensureField(objStr, field, defaultValue) {
    if (!objStr.includes(`"${field}":`)) {
        // Find a place to insert. We'll insert after the last field before the closing brace.
        // Or just before the closing brace.
        return objStr.replace(/\}(\s*)$/, `,\n    "${field}": ${JSON.stringify(defaultValue)}$1}`);
    }
    return objStr;
}

// Use regex to process each object literal
content = content.replace(/\{[\s\S]*?\}/g, (match) => {
    let updated = match;
    // Required fields: mobileNumber, notes, position (already mostly handled), quantity (already mostly handled)
    updated = ensureField(updated, "mobileNumber", "");
    updated = ensureField(updated, "notes", "");
    updated = ensureField(updated, "position", "Не вказано");

    // Ensure numeric fields are numbers if they exist as 0 or empty string in some cases
    // (though usually they are numbers)

    return updated;
});

// Final cleanup for commas
content = content.replace(/,\s*,/g, ',');
content = content.replace(/,\s*\}/g, '\n  }');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Mock data fields verified and updated.");
