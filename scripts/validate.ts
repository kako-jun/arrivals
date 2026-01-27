#!/usr/bin/env npx tsx
/**
 * Validate all meta.json and voices.json files
 * Usage: npx tsx scripts/validate.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { MetaSchema, VoicesSchema } from '../src/schemas';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const PUBLIC_DIR = path.join(process.cwd(), 'public/content');

interface ValidationResult {
  file: string;
  errors: string[];
}

function findJsonFiles(dir: string, pattern: string): string[] {
  const results: string[] = [];

  function walk(currentDir: string) {
    if (!fs.existsSync(currentDir)) return;

    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === pattern) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

function validateMetaFiles(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const metaFiles = findJsonFiles(DATA_DIR, 'meta.json');

  for (const file of metaFiles) {
    const relativePath = path.relative(process.cwd(), file);
    const errors: string[] = [];

    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const result = MetaSchema.safeParse(content);

      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push(`${issue.path.join('.')}: ${issue.message}`);
        }
      }

      // Check required assets
      const match = file.match(/data\/([^/]+)\/([^/]+)\/meta\.json$/);
      if (match) {
        const [, app] = match;
        const assetDir = path.join(PUBLIC_DIR, app);

        const requiredAssets = ['icon.png', 'hero.webp'];
        for (const asset of requiredAssets) {
          if (!fs.existsSync(path.join(assetDir, asset))) {
            errors.push(`Missing required asset: public/content/${app}/${asset}`);
          }
        }

        // Check gallery images if defined
        if (content.gallery) {
          for (const galleryPath of content.gallery) {
            const fullGalleryPath = path.join(process.cwd(), 'public', galleryPath);
            if (!fs.existsSync(fullGalleryPath)) {
              errors.push(`Missing gallery image: public/${galleryPath}`);
            }
          }
        }
      }
    } catch (e) {
      errors.push(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    }

    if (errors.length > 0) {
      results.push({ file: relativePath, errors });
    }
  }

  return results;
}

function validateVoicesFiles(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const voicesFiles = findJsonFiles(DATA_DIR, 'voices.json');

  for (const file of voicesFiles) {
    const relativePath = path.relative(process.cwd(), file);
    const errors: string[] = [];

    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const result = VoicesSchema.safeParse(content);

      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push(`${issue.path.join('.')}: ${issue.message}`);
        }
      }
    } catch (e) {
      errors.push(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
    }

    if (errors.length > 0) {
      results.push({ file: relativePath, errors });
    }
  }

  return results;
}

function main() {
  console.log('Validating content files...\n');

  const metaResults = validateMetaFiles();
  const voicesResults = validateVoicesFiles();
  const allResults = [...metaResults, ...voicesResults];

  if (allResults.length === 0) {
    console.log('✓ All content files are valid');
    process.exit(0);
  }

  console.log('Validation errors:\n');
  for (const result of allResults) {
    console.log(`✗ ${result.file}`);
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
    console.log();
  }

  process.exit(1);
}

main();
