#!/usr/bin/env node
// nano — UserPromptSubmit hook
// Traccia /nano on/off + rinforzo per-turno

const fs = require('fs');
const path = require('path');
const os = require('os');
const { safeWriteFlag, readFlag } = require('./nano-config');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const flagPath = path.join(claudeDir, '.nano-active');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').trim();
    const promptLower = prompt.toLowerCase();

    // Attivazione natural language
    if (/\b(attiva|abilita|usa|enable|turn on|start|modalità)\b.*\bnano\b/i.test(promptLower) ||
        /\bnano\b.*\b(mode|modalità|attiva|enable)\b/i.test(promptLower) ||
        /\b(meno token|massima efficienza|ultra compresso)\b/i.test(promptLower)) {
      if (!/\b(stop|disattiva|disable|turn off)\b/i.test(promptLower)) {
        safeWriteFlag(flagPath, 'on');
      }
    }

    // Comando /nano
    if (promptLower.startsWith('/nano')) {
      const parts = promptLower.split(/\s+/);
      const arg = parts[1] || '';
      if (arg === 'off' || arg === 'stop') {
        try { fs.unlinkSync(flagPath); } catch (e) {}
      } else {
        safeWriteFlag(flagPath, 'on');
      }
    }

    // Disattivazione
    if (/\b(stop|disattiva|disable|turn off|deactivate)\b.*\bnano\b/i.test(promptLower) ||
        /\bnano\b.*\b(stop|disattiva|off)\b/i.test(promptLower) ||
        /\b(modalità normale|normal mode)\b/i.test(promptLower)) {
      try { fs.unlinkSync(flagPath); } catch (e) {}
    }

    // Rinforzo per-turno
    const active = readFlag(flagPath);
    if (active === 'on') {
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          additionalContext:
            "NANO MODE ACTIVE. " +
            "YES/NO for binary questions. Symbols over words (→ ∴ ≈ +). " +
            "Drop subject/verb when obvious. Zero intro/recap/hedging. " +
            "One word if enough. Code/commit/security: write normal."
        }
      }));
    }
  } catch (e) {
    // Silent fail
  }
});
