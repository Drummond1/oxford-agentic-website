import fs from 'fs';
import path from 'path';
const walk=(d)=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const css=walk('dist').filter(f=>f.endsWith('.css'));
const refs=new Set();
for (const f of css) for (const m of fs.readFileSync(f,'utf8').matchAll(/url\(["']?(\/[^"')]+)["']?\)/g)) refs.add(m[1]);
console.log(`css files: ${css.length} | url() refs: ${refs.size}`);
let miss=0;
for (const r of refs) if (!fs.existsSync(path.join('dist', decodeURIComponent(r)))) { console.log('  MISSING', r); miss++; }
console.log(`missing: ${miss}`);
console.log('\nfont files shipped:'); 
walk('dist/fonts').forEach(f=>console.log('  '+path.basename(f)));
console.log('\npreloaded in <head>:');
const h=fs.readFileSync('dist/index.html','utf8');
[...h.matchAll(/rel="preload" href="([^"]+)"/g)].forEach(m=>console.log('  '+m[1]));
