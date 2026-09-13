#!/usr/bin/env node
/**
 * Sqolah AI Multi-Provider Command Line Interface (CLI)
 * Compatible with OpenAI, Google Gemini, DeepSeek, Anthropic Claude, and OpenRouter.
 */

import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if exists in current dir or parent
function loadEnv() {
  const possiblePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '..', '.env')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf-8');
        content.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) return;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const k = trimmed.slice(0, eqIdx).trim();
            const v = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[k]) {
              process.env[k] = v;
            }
          }
        });
      } catch {}
    }
  }
}

loadEnv();

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m'
};

const PROVIDER_CONFIGS = {
  openai: {
    name: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    envKey: 'OPENAI_API_KEY',
    call: async (key, model, prompt) => {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || 'No response.';
    }
  },
  gemini: {
    name: 'Google Gemini',
    defaultModel: 'gemini-1.5-flash',
    envKey: 'GEMINI_API_KEY',
    call: async (key, model, prompt) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
    }
  },
  deepseek: {
    name: 'DeepSeek',
    defaultModel: 'deepseek-chat',
    envKey: 'DEEPSEEK_API_KEY',
    call: async (key, model, prompt) => {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || 'No response.';
    }
  },
  claude: {
    name: 'Anthropic Claude',
    defaultModel: 'claude-3-5-haiku-20241022',
    envKey: 'ANTHROPIC_API_KEY',
    call: async (key, model, prompt) => {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return data.content?.[0]?.text || 'No response.';
    }
  },
  custom: {
    name: 'Custom / OpenRouter',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    envKey: 'OPENROUTER_API_KEY',
    call: async (key, model, prompt, baseUrl = 'https://openrouter.ai/api/v1') => {
      const endpoint = baseUrl.replace(/\/+$/, '') + '/chat/completions';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || 'No response.';
    }
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
let currentProvider = 'gemini';
let currentModel = '';
let explicitKey = '';
let askPrompt = '';
let runTest = false;
let showHelp = false;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--provider' || a === '-p') {
    currentProvider = args[++i]?.toLowerCase();
  } else if (a === '--key' || a === '-k') {
    explicitKey = args[++i];
  } else if (a === '--model' || a === '-m') {
    currentModel = args[++i];
  } else if (a === '--ask' || a === '-a') {
    askPrompt = args[++i];
  } else if (a === '--test' || a === '-t') {
    runTest = true;
  } else if (a === '--help' || a === '-h') {
    showHelp = true;
  }
}

function printBanner() {
  console.log(`${colors.cyan}${colors.bright}
  =============================================================
     SQOLAH MULTI-PROVIDER AI TERMINAL CLI (Node.js Engine)
     Support: OpenAI • Gemini • DeepSeek • Claude • OpenRouter
  =============================================================${colors.reset}\n`);
}

function getResolvedKey(provider) {
  if (explicitKey) return explicitKey;
  const cfg = PROVIDER_CONFIGS[provider];
  if (!cfg) return '';
  return process.env[cfg.envKey] || process.env[`${provider.toUpperCase()}_API_KEY`] || '';
}

async function executePrompt(provider, prompt) {
  const cfg = PROVIDER_CONFIGS[provider];
  if (!cfg) {
    console.log(`${colors.red}Error: Provider "${provider}" tidak dikenal.${colors.reset}`);
    return;
  }

  const key = getResolvedKey(provider);
  if (!key) {
    console.log(`${colors.red}Error: Kunci API untuk ${cfg.name} belum disetel.${colors.reset}`);
    console.log(`${colors.yellow}Petunjuk: Berikan flag --key <API_KEY> atau setel variabel lingkungan ${cfg.envKey}.${colors.reset}`);
    return;
  }

  const model = currentModel || cfg.defaultModel;
  process.stdout.write(`${colors.gray}Mengirim ke ${cfg.name} (${model})...${colors.reset}\n`);

  const startTime = Date.now();
  try {
    const res = await cfg.call(key, model, prompt);
    const elapsed = Date.now() - startTime;
    console.log(`\n${colors.green}${colors.bright}[${cfg.name} - ${model}] (${elapsed}ms):${colors.reset}\n${res}\n`);
  } catch (err) {
    console.log(`\n${colors.red}[GAGAL] ${err.message}${colors.reset}\n`);
  }
}

async function executeTest(provider) {
  const cfg = PROVIDER_CONFIGS[provider];
  if (!cfg) {
    console.log(`${colors.red}Error: Provider "${provider}" tidak dikenal.${colors.reset}`);
    return;
  }

  const key = getResolvedKey(provider);
  if (!key) {
    console.log(`${colors.red}Error: Kunci API untuk ${cfg.name} belum disetel di environment atau flag.${colors.reset}`);
    return;
  }

  const model = currentModel || cfg.defaultModel;
  console.log(`${colors.yellow}Menguji koneksi ke ${cfg.name} (${model})...${colors.reset}`);
  const startTime = Date.now();
  try {
    await cfg.call(key, model, 'Balas satu kata: SIAP');
    const elapsed = Date.now() - startTime;
    console.log(`${colors.green}✓ [BERHASIL] Koneksi ke ${cfg.name} terverifikasi! Latensi: ${elapsed}ms${colors.reset}`);
  } catch (err) {
    console.log(`${colors.red}✗ [GAGAL] ${err.message}${colors.reset}`);
  }
}

// Direct Flag execution mode
if (showHelp) {
  printBanner();
  console.log(`Penggunaan CLI Sqolah:
  node scripts/sqolah-cli.mjs [options]
  npm run cli -- [options]

Opsi Flag:
  -p, --provider <name>   Pilih penyedia (openai, gemini, deepseek, claude, custom)
  -k, --key <api_key>     Gunakan API Key spesifik untuk eksekusi
  -m, --model <model>     Tentukan model AI yang ingin dipanggil
  -a, --ask "<prompt>"    Ajukan pertanyaan langsung dan cetak jawaban
  -t, --test              Uji koneksi ke endpoint provider aktif
  -h, --help              Tampilkan panduan ini

Mode Interaktif:
  Jalankan perintah tanpa argumen: "npm run cli" untuk masuk ke mode REPL interaktif.
  `);
  process.exit(0);
}

if (runTest) {
  printBanner();
  await executeTest(currentProvider);
  process.exit(0);
}

if (askPrompt) {
  printBanner();
  await executePrompt(currentProvider, askPrompt);
  process.exit(0);
}

// Interactive REPL Mode
printBanner();
const activeKey = getResolvedKey(currentProvider);
console.log(`${colors.cyan}Mode Interaktif Aktif.${colors.reset}`);
console.log(`Provider saat ini : ${colors.bright}${currentProvider.toUpperCase()}${colors.reset}`);
console.log(`API Key status    : ${activeKey ? `${colors.green}Tersedia di Environment${colors.reset}` : `${colors.yellow}Belum ada (Ketik "key <API_KEY>" untuk memasukkan)${colors.reset}`}`);
console.log(`Ketik ${colors.bright}help${colors.reset} untuk melihat perintah atau langsung ketik pertanyaan.\n`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `${colors.green}sqolah-ai (${currentProvider})> ${colors.reset}`
});

rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();
  if (!input) {
    rl.prompt();
    return;
  }

  const parts = input.split(' ');
  const cmd = parts[0].toLowerCase();
  const rest = parts.slice(1).join(' ');

  switch (cmd) {
    case 'exit':
    case 'quit':
      console.log(`${colors.cyan}Sampai jumpa di sesi belajar Sqolah berikutnya!${colors.reset}`);
      process.exit(0);
      break;

    case 'clear':
      console.clear();
      printBanner();
      break;

    case 'help':
      console.log(`
Perintah REPL:
  • use <provider> [model] : Ganti provider (openai, gemini, deepseek, claude, custom)
  • key <api_key>          : Setel API key aktif sesi ini
  • test                   : Uji koneksi ke provider aktif
  • status                 : Periksa konfigurasi saat ini
  • clear                  : Bersihkan layar
  • exit                   : Keluar dari CLI
  • <pertanyaan apa saja>  : Dikirim langsung ke AI untuk dijawab
      `);
      break;

    case 'use':
      if (parts[1] && PROVIDER_CONFIGS[parts[1].toLowerCase()]) {
        currentProvider = parts[1].toLowerCase();
        if (parts[2]) currentModel = parts[2];
        console.log(`${colors.green}Provider diganti ke: ${currentProvider.toUpperCase()}${colors.reset}`);
        rl.setPrompt(`${colors.green}sqolah-ai (${currentProvider})> ${colors.reset}`);
      } else {
        console.log(`${colors.red}Provider tidak valid. Pilihan: openai, gemini, deepseek, claude, custom${colors.reset}`);
      }
      break;

    case 'key':
      if (parts[1]) {
        explicitKey = parts[1].trim();
        console.log(`${colors.green}API Key untuk sesi ini berhasil disimpan.${colors.reset}`);
      } else {
        console.log(`${colors.yellow}Format: key <API_KEY>${colors.reset}`);
      }
      break;

    case 'test':
      await executeTest(currentProvider);
      break;

    case 'status': {
      const k = getResolvedKey(currentProvider);
      const masked = k ? `${k.slice(0, 4)}...${k.slice(-4)}` : 'BELUM DIATUR';
      console.log(`
Status Sesi CLI:
  Provider : ${currentProvider.toUpperCase()}
  Model    : ${currentModel || PROVIDER_CONFIGS[currentProvider]?.defaultModel}
  API Key  : ${masked}
      `);
      break;
    }

    default:
      await executePrompt(currentProvider, input);
      break;
  }

  rl.prompt();
});
