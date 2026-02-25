const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'output.json');
const outputPath = path.join(process.cwd(), 'src/app/data/mockData.ts');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function mapIssuance(rows) {
    if (!rows || rows.length <= 1) return [];
    return rows.slice(1).filter(r => r && r[0]).map((r, i) => ({
        id: 'iss-' + i,
        nomenclature: String(r[0] || ''),
        type: String(r[1] || ''),
        model: String(r[2] || ''),
        serialNumber: String(r[3] || ''),
        fullName: String(r[4] || ''),
        department: String(r[5] || ''),
        request: String(r[6] === true ? 'Так' : (r[6] === false ? 'Ні' : (r[6] || ''))),
        requestNumber: String(r[7] || ''),
        issueDate: String(r[8] || ''),
        location: String(r[9] || ''),
        status: String(r[10] || ''),
        notes: String(r[11] || ''),
        quantity: 1
    }));
}

function mapNeeds(rows) {
    if (!rows || rows.length <= 1) return [];
    return rows.slice(1).filter(r => r && r[0]).map((r, i) => ({
        id: 'need-' + i,
        nomenclature: String(r[0] || ''),
        type: String(r[1] || ''),
        quantity: Number(r[2] || 0),
        contactPerson: String(r[3] || ''),
        position: String(r[4] || ''),
        department: String(r[5] || ''),
        mobileNumber: String(r[6] || ''),
        requestDate: String(r[7] || ''),
        location: String(r[8] || ''),
        status: String(r[9] || ''),
        notes: String(r[10] || '')
    }));
}

function mapRejected(rows) {
    if (!rows || rows.length <= 1) return [];
    return rows.slice(1).filter(r => r && r[0]).map((r, i) => ({
        id: 'rej-' + i,
        nomenclature: String(r[0] || ''),
        type: String(r[1] || ''),
        quantity: Number(r[2] || 0),
        fullName: String(r[4] || ''),
        position: String(r[5] || ''),
        department: String(r[6] || ''),
        mobileNumber: String(r[7] || ''),
        status: String(r[8] || ''),
        notes: String(r[9] || ''),
        rejectedDate: ''
    }));
}

const issuance = mapIssuance(data.sheets['Видача'] ? data.sheets['Видача'].rows : []);
const needs = mapNeeds(data.sheets['Потреба'] ? data.sheets['Потреба'].rows : []);
const rejected = mapRejected(data.sheets['Відхилені'] ? data.sheets['Відхилені'].rows : []);

const output = "import { IssuanceRecord, NeedRecord, RejectedRecord } from '../types';\n\n" +
    "export const mockIssuanceData: IssuanceRecord[] = " + JSON.stringify(issuance, null, 2) + ";\n\n" +
    "export const mockNeedsData: NeedRecord[] = " + JSON.stringify(needs, null, 2) + ";\n\n" +
    "export const mockRejectedData: RejectedRecord[] = " + JSON.stringify(rejected, null, 2) + ";\n";

fs.writeFileSync(outputPath, output);
console.log('Done');
