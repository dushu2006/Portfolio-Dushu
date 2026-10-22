import { defineConfig } from '@playwright/test';
import chromium from '@sparticuz/chromium';
export default defineConfig({ testDir: './tests', timeout: 60000, workers: 1, use: { baseURL: 'http://localhost:3000', headless: true, launchOptions: { executablePath: process.env.CHROMIUM_PATH || '/tmp/chromium', args: chromium.args.filter(a => a !== "--single-process") }, screenshot: 'only-on-failure' } });
