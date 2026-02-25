const fs = require('fs');

const filePath = 'd:/Azv/DataManagementInterface/src/app/data/mockData.ts';
let content = fs.readFileSync(filePath, 'utf8');

const needsRegex = /export const mockNeedsData: NeedRecord\[\] = \[([\s\S]*?)\];/;
const issuanceRegex = /export const mockIssuanceData: IssuanceRecord\[\] = \[([\s\S]*?)\];/;
const rejectedRegex = /export const mockRejectedData: RejectedRecord\[\] = \[([\s\S]*?)\];/;

const needsMatch = content.match(needsRegex);
const issuanceMatch = content.match(issuanceRegex);
const rejectedMatch = content.match(rejectedRegex);

if (!needsMatch || !issuanceMatch || !rejectedMatch) {
    console.error('Could not find all arrays');
    process.exit(1);
}

function getObjects(str) {
    const objs = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '{') depth++;
        if (depth > 0) current += str[i];
        if (str[i] === '}') {
            depth--;
            if (depth === 0) {
                try {
                    let jsonStr = current.trim();
                    if (jsonStr.endsWith(',')) jsonStr = jsonStr.slice(0, -1);
                    objs.push(JSON.parse(jsonStr));
                } catch (e) {
                    console.error('Failed to parse object:', current);
                }
                current = '';
            }
        }
    }
    return objs;
}

const needs = getObjects(needsMatch[1]);
const issuances = getObjects(issuanceMatch[1]);
const rejecteds = getObjects(rejectedMatch[1]);

console.log(`Initial counts: Needs: ${needs.length}, Issuances: ${issuances.length}, Rejected: ${rejecteds.length}`);

const defaultDate = "24.02.2026";

needs.forEach(n => {
    if (n.requestDate === "") n.requestDate = defaultDate;
});

issuances.forEach(i => {
    if (i.issueDate === "") i.issueDate = defaultDate;
});

rejecteds.forEach(r => {
    if (r.rejectedDate === "") r.rejectedDate = defaultDate;
});

function toPrettyStr(objs) {
    if (objs.length === 0) return "";
    return objs.map(obj => JSON.stringify(obj, null, 2).split('\n').map(line => '  ' + line).join('\n')).join(',\n');
}

let newContent = content.replace(needsRegex, `export const mockNeedsData: NeedRecord[] = [\n${toPrettyStr(needs)}\n];`);
newContent = newContent.replace(issuanceRegex, `export const mockIssuanceData: IssuanceRecord[] = [\n${toPrettyStr(issuances)}\n];`);
newContent = newContent.replace(rejectedRegex, `export const mockRejectedData: RejectedRecord[] = [\n${toPrettyStr(rejecteds)}\n];`);

fs.writeFileSync(filePath, newContent);
console.log('Update complete.');
