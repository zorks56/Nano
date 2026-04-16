#!/usr/bin/env node
// claude-plugin-nano — installer
// Copies hook files to ~/.claude/hooks/nano/ and patches settings.json

const fs = require('fs');
const path = require('path');
const os = require('os');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const hooksDir = path.join(claudeDir, 'hooks', 'nano');
const skillsDir = path.join(claudeDir, 'skills', 'nano');
const settingsPath = path.join(claudeDir, 'settings.json');

const pkgRoot = __dirname;

// ── 1. Copy hook files ────────────────────────────────────────────────────────
fs.mkdirSync(hooksDir, { recursive: true });
fs.mkdirSync(skillsDir, { recursive: true });

const hookFiles = ['nano-config.js', 'nano-activate.js', 'nano-tracker.js', 'package.json'];
for (const file of hookFiles) {
  fs.copyFileSync(path.join(pkgRoot, 'hooks', file), path.join(hooksDir, file));
}

// Copy SKILL.md
fs.copyFileSync(
  path.join(pkgRoot, 'skills', 'nano', 'SKILL.md'),
  path.join(skillsDir, 'SKILL.md')
);

// ── 2. Patch settings.json ────────────────────────────────────────────────────
let settings = {};
try {
  settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
} catch (e) {
  // File missing or invalid — start fresh
}

if (!settings.hooks) settings.hooks = {};

// SessionStart
if (!settings.hooks.SessionStart) settings.hooks.SessionStart = [];
const hasStart = settings.hooks.SessionStart.some(e =>
  e.hooks && e.hooks.some(h => h.command && h.command.includes('nano-activate'))
);
if (!hasStart) {
  settings.hooks.SessionStart.push({
    hooks: [{
      type: 'command',
      command: `node "${path.join(hooksDir, 'nano-activate.js').replace(/\\/g, '/')}"`,
      timeout: 5,
      statusMessage: 'Loading nano mode...'
    }]
  });
}

// UserPromptSubmit
if (!settings.hooks.UserPromptSubmit) settings.hooks.UserPromptSubmit = [];
const hasPrompt = settings.hooks.UserPromptSubmit.some(e =>
  e.hooks && e.hooks.some(h => h.command && h.command.includes('nano-tracker'))
);
if (!hasPrompt) {
  settings.hooks.UserPromptSubmit.push({
    hooks: [{
      type: 'command',
      command: `node "${path.join(hooksDir, 'nano-tracker.js').replace(/\\/g, '/')}"`,
      timeout: 5,
      statusMessage: 'nano...'
    }]
  });
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');

console.log('');
console.log('✓ nano installed successfully');
console.log('  Hooks: ' + hooksDir);
console.log('  Skill: ' + skillsDir);
console.log('');
console.log('  Restart Claude Code to activate.');
console.log('');
