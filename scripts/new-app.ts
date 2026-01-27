#!/usr/bin/env npx tsx
/**
 * Create a new app scaffold
 * Usage: npx tsx scripts/new-app.ts <app-name>
 */

import fs from 'node:fs';
import path from 'node:path';
import { SUPPORTED_LOCALES, DEFAULT_THEME, ASSET_DIMENSIONS } from '../src/lib/constants';

const META_TEMPLATE = {
  name: '',
  catch: '',
  description: '',
  theme: { ...DEFAULT_THEME },
  links: {
    play: '',
    github: '',
  },
  og: {
    title: '',
    description: '',
    image: '',
  },
  gallery: [] as string[],
  author: {
    name: '',
  },
};

const VOICES_TEMPLATE = [{ text: 'Example review', by: '@user' }];

function createApp(appName: string) {
  const dataDir = path.join(process.cwd(), 'src/data', appName);
  const publicDir = path.join(process.cwd(), 'public/content', appName);
  const galleryDir = path.join(publicDir, 'gallery');

  // Check if already exists
  if (fs.existsSync(dataDir)) {
    console.error(`Error: App "${appName}" already exists at ${dataDir}`);
    process.exit(1);
  }

  // Create directories
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(galleryDir, { recursive: true });

  // Create locale directories and files
  for (const locale of SUPPORTED_LOCALES) {
    const localeDir = path.join(dataDir, locale);
    fs.mkdirSync(localeDir, { recursive: true });

    // Create meta.json
    const meta = {
      ...META_TEMPLATE,
      name: appName,
      og: {
        ...META_TEMPLATE.og,
        title: appName,
      },
    };
    fs.writeFileSync(path.join(localeDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

    // Create voices.json
    fs.writeFileSync(
      path.join(localeDir, 'voices.json'),
      JSON.stringify(VOICES_TEMPLATE, null, 2) + '\n'
    );
  }

  // Create placeholder files
  const { icon, hero, og } = ASSET_DIMENSIONS;
  const placeholders = [
    { file: 'icon.png', desc: `App icon (${icon.width}x${icon.height})` },
    { file: 'hero.webp', desc: `Hero image (${hero.width}x${hero.height})` },
    { file: 'og.png', desc: `OG image (${og.width}x${og.height})` },
  ];

  // Create README in public dir
  const readmeContent = `# ${appName} Assets

Required files:
${placeholders.map((p) => `- ${p.file}: ${p.desc}`).join('\n')}

Optional:
- hero.mp4: Hero video
- gallery/*.jpg: Screenshot images
`;

  fs.writeFileSync(path.join(publicDir, 'README.md'), readmeContent);

  console.log(`✓ Created app scaffold: ${appName}`);
  console.log();
  console.log('Next steps:');
  console.log(`1. Edit src/data/${appName}/*/meta.json with app details`);
  console.log(`2. Add images to public/content/${appName}/`);
  console.log('3. Run: pnpm build');
  console.log();
  console.log('Required assets:');
  for (const p of placeholders) {
    console.log(`  - public/content/${appName}/${p.file} (${p.desc})`);
  }
}

function main() {
  const appName = process.argv[2];

  if (!appName) {
    console.log('Usage: npx tsx scripts/new-app.ts <app-name>');
    console.log();
    console.log('Example: npx tsx scripts/new-app.ts myapp');
    process.exit(1);
  }

  // Validate app name
  if (!/^[a-z0-9-]+$/.test(appName)) {
    console.error('Error: App name must only contain lowercase letters, numbers, and hyphens');
    process.exit(1);
  }

  createApp(appName);
}

main();
