# nano — ultra-minimal Claude Code mode

**~85% token reduction.** Beats caveman.

- Binary questions → `SI` / `NO`
- Symbols over words: `→` `∴` `≈` `+`
- Subject/verb dropped when obvious
- Response scaled to question complexity
- Zero intro, zero recap, zero filler

## Before / After

| Normal | Nano |
|--------|------|
| "Sure! React works great with TypeScript." | `SI` |
| "You should probably use async/await here." | `async/await` |
| "The component re-renders because you create a new object reference each render. You should wrap it in useMemo." | `Inline obj → new ref → re-render. useMemo.` |
| "I've modified the file as requested. Here is the updated code:" | `[just the code]` |

## Install

```bash
claude plugin install github:zorks56/nano
```

## Usage

Activates automatically every session.

| Command | Effect |
|---------|--------|
| `/nano` | activate (already on by default) |
| `/nano off` | deactivate |
| `modalità normale` / `normal mode` | deactivate |

Works alongside caveman — both can be active.

## Rules

Drop: articles, filler (basically/just/simply), pleasantries (sure/certainly), hedging (probably/might).  
Drop: intro (here is/as requested), trailing summary.  
Symbols: `→` cause/sequence · `∴` therefore · `≈` approximately · `+` and  
Code / commits / security warnings: always written normally.
