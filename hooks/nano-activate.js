#!/usr/bin/env node
// nano — SessionStart hook
// Scrive flag + inietta ruleset come contesto di sessione

const fs = require('fs');
const path = require('path');
const os = require('os');
const { safeWriteFlag } = require('./nano-config');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.nano-active');

// Attiva per default ad ogni sessione
safeWriteFlag(flagPath, 'on');

// Leggi SKILL.md — prima dal plugin root, fallback da claudeDir
let skillContent = '';
try {
  skillContent = fs.readFileSync(
    path.join(__dirname, '..', 'skills', 'nano', 'SKILL.md'), 'utf8'
  );
} catch (e) {
  try {
    skillContent = fs.readFileSync(
      path.join(claudeDir, 'skills', 'nano', 'SKILL.md'), 'utf8'
    );
  } catch (e2) {}
}

let output;
if (skillContent) {
  // Strip frontmatter YAML
  const body = skillContent.replace(/^---[\s\S]*?---\s*/, '');
  output = 'NANO MODE ACTIVE\n\n' + body;
} else {
  // Fallback hardcoded
  output =
    'NANO MODE ACTIVE\n\n' +
    'Risposta minima. SI/NO per domande binarie. Simboli > parole.\n' +
    'Drop: articoli, filler, hedging, intro, riepilogo.\n' +
    '→ causa/sequenza · ∴ quindi · ≈ circa\n' +
    'Soggetto/verbo omessi se ovvi. Code/commit/PR: normale.';
}

process.stdout.write(output);
