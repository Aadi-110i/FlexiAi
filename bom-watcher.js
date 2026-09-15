const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, 'app/globals.css');

function stripBOM() {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) {
      fs.writeFileSync(file, content.slice(1), 'utf8');
      console.log('[BOM watcher] Stripped BOM from globals.css');
    }
  } catch (e) {
    // file locked briefly during save, skip
  }
}

console.log('[BOM watcher] Watching globals.css for BOM corruption...');

// Debounce so we don't re-read mid-write
let timer;
fs.watch(file, () => {
  clearTimeout(timer);
  timer = setTimeout(stripBOM, 80);
});
