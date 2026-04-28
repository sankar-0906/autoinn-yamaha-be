const fs = require('fs');
const path = require('path');

function getFiles(dir, exts) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath, exts));
        } else {
            if (exts.some(ext => fullPath.endsWith(ext))) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

const controllersDir = path.join(__dirname, 'src', 'modules');
const controllerFiles = getFiles(controllersDir, ['.controller.ts']);

for (const file of controllerFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let original = content;

    if (!content.includes('handleApiError')) {
        const lines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('import ')) {
                lastImportIndex = i;
            }
        }

        const importStatement = `import { handleApiError } from '../../utils/errorHandler.js';`;
        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, importStatement);
        } else {
            lines.unshift(importStatement);
        }
        content = lines.join('\n');
    }

    // Replace basic catch blocks
    content = content.replace(/res\.status\(\d+\)\.json\([^)]*error\.message[^)]*\);?/g, 'return handleApiError(res, error);');
    // We can also target typical catch blocks directly
    content = content.replace(/res\.status\(\d+\)\.json\(\{\s*success:\s*false,\s*message:\s*[^}]*\}\);?/g, 'return handleApiError(res, error);');

    // Fix possible duplicated returns
    content = content.replace(/return\s+return\s+handleApiError/g, 'return handleApiError');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log('Updated:', path.basename(file));
    }
}
