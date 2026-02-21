import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = [...walk('./frontend-student/src'), ...walk('./frontend-vendor/src')];
const baseURL = "import.meta.env.VITE_API_URL || 'http://localhost:9999'";

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. replace exact string 'http://localhost:9999' or "http://localhost:9999"
    if (content.includes("'http://localhost:9999'") || content.includes('"http://localhost:9999"')) {
        content = content.replace(/'http:\/\/localhost:9999'/g, `(${baseURL})`);
        content = content.replace(/"http:\/\/localhost:9999"/g, `(${baseURL})`);
        changed = true;
    }

    // 2. string concat like 'http://localhost:9999/auth' -> `...`/auth
    const regex1 = /'http:\/\/localhost:9999([^']*)'/g;
    if (regex1.test(content)) {
        content = content.replace(regex1, `\`\${${baseURL}}$1\``);
        changed = true;
    }

    const regex2 = /"http:\/\/localhost:9999([^"]*)"/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, `\`\${${baseURL}}$1\``);
        changed = true;
    }

    // 3. template literals `http://localhost:9999/auth` -> `${...}/auth`
    const regex3 = /`http:\/\/localhost:9999([^`]*)`/g;
    if (regex3.test(content)) {
        content = content.replace(regex3, `\`\${${baseURL}}$1\``);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
});
