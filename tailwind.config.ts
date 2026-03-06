import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let themeExtend: Record<string, unknown> = {};
try {
  const themePath = path.resolve(__dirname, 'src/data/theme.json');
  if (fs.existsSync(themePath)) {
    themeExtend = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
  }
} catch {
  // Use empty theme extension when parsing fails.
}

function flattenColorsToVars(
  colors: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    if (value == null) continue;
    const name = key === 'DEFAULT' && prefix ? prefix : prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'string') {
      vars[name] = value;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(vars, flattenColorsToVars(value as Record<string, unknown>, name));
    }
  }
  return vars;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx,js,jsx,html,json}'],
  blocklist: ['pt-[env(safe-area-inset-top)]', 'pb-[env(safe-area-inset-bottom)]'],
  theme: {
    extend: themeExtend,
  },
  plugins: [
    function ({
      addBase,
      theme,
    }: {
      addBase: (styles: Record<string, Record<string, string>>) => void;
      theme: (path: string) => unknown;
    }) {
      const colors = theme('colors') as Record<string, unknown> | undefined;
      if (!colors || typeof colors !== 'object') return;
      const vars = flattenColorsToVars(colors);
      const root: Record<string, string> = {};
      for (const [name, value] of Object.entries(vars)) {
        root[`--color-${name}`] = value;
      }
      if (Object.keys(root).length > 0) {
        addBase({ ':root': root });
      }
    },
  ],
};
