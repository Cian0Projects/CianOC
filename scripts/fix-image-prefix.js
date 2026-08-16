/**
 * Works around a gatsby-plugin-sharp bug where `gatsby build --prefix-paths`
 * fails to prepend `pathPrefix` to generated image URLs (src/srcSet) inside
 * page-data/sq/d/*.json, even though every other asset URl is prefixed
 * correctly. Confirmed present when building with a newer Node than this
 * project's pinned .nvmrc (v16) supports; rewriting the JSON here means a
 * broken Node version can't silently ship 404ing images again.
 *
 * Runs after `gatsby build` and before the gh-pages publish step.
 */
const fs = require('fs');
const path = require('path');
const config = require('../gatsby-config');

const prefix = config.pathPrefix;
const dir = path.join(__dirname, '..', 'public', 'page-data', 'sq', 'd');

if (!prefix) {
  console.log('fix-image-prefix: no pathPrefix configured, nothing to do.');
  process.exit(0);
}

if (!fs.existsSync(dir)) {
  console.log(`fix-image-prefix: ${dir} does not exist, skipping.`);
  process.exit(0);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  const original = fs.readFileSync(filePath, 'utf8');

  // Only touch "/static/..." that isn't already prefixed.
  const pattern = new RegExp(`"/static/`, 'g');
  const alreadyPrefixed = original.includes(`"${prefix}/static/`);
  const matches = original.match(pattern);

  if (!matches) {
    continue;
  }

  const fixed = original.replace(pattern, `"${prefix}/static/`);
  fs.writeFileSync(filePath, fixed, 'utf8');
  totalFixed += matches.length;
  console.log(`fix-image-prefix: patched ${matches.length} URL(s) in ${file}`);

  if (alreadyPrefixed) {
    console.warn(`fix-image-prefix: WARNING ${file} had a mix of prefixed and unprefixed URLs.`);
  }
}

console.log(`fix-image-prefix: done, ${totalFixed} URL(s) patched across ${files.length} file(s).`);
