const fs = require('fs');

const file = process.argv[2];
let content = fs.readFileSync(file, 'utf-8');
const original = content;

// Check import
if (!content.includes('handleApiError')) {
    const importStatement = "import { handleApiError } from '../../utils/errorHandler.js';\n";
    // naive insert after the first import block
    content = importStatement + content;
}

// Find standard catches and replace them
// res.status(500).json({ success: false, message: error.message })
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('res.status(500)') || lines[i].includes('res.status(400)')) {
        if (lines[i].includes('error.message') || lines[i].includes('err.message') || lines[i].includes('message: error')) {
            const spaces = lines[i].match(/^\s*/)[0];
            const hasReturn = lines[i].includes('return ');
            const errVar = lines[i].includes('err.message') ? 'err' : 'error';
            lines[i] = `${spaces}${hasReturn ? 'return ' : ''}handleApiError(res, ${errVar});`;
        }
    }
}

content = lines.join('\n');

if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated ${file}`);
}
