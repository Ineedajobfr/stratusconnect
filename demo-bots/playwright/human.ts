// Demo Bots Human Helpers - Beta Terminal Testing
// FCA Compliant Aviation Platform - Realistic Human Behavior

import { Page } from '@playwright/test';

export function rand(min: number, max: number) { 
  return min + Math.random() * (max - min); 
}

export async function waitHuman(msAvg: number, jitter = 0.35) {
  const ms = msAvg * (1 - jitter + Math.random() * 2 * jitter);
  await new Promise(r => setTimeout(r, ms));
}

function logNormal(meanMs: number, sigma = 0.6) {
  const mu = Math.log(meanMs) - (sigma * sigma) / 2;
  const u = Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(8, Math.exp(mu + sigma * z));
}

export async function think(msAvg = 900) { 
  await new Promise(r => setTimeout(r, logNormal(msAvg))); 
}

export async function typeHuman(page: Page, sel: string, text: string, wpm = 42, err = 0.04) {
  const cps = (wpm / 60) * 5;
  for (const ch of text) {
    if (Math.random() < err && /\w/.test(ch)) {
      await page.type(sel, 'x');
      await waitHuman(120);
      await page.keyboard.press('Backspace');
    }
    await page.type(sel, ch);
    await new Promise(r => setTimeout(r, logNormal(1000 / cps)));
  }
}

export async function clickHuman(page: Page, sel: string) {
  const el = page.locator(sel).first();
  await el.hover();
  await waitHuman(rand(140, 420));
  const box = await el.boundingBox();
  if (box) {
    await page.mouse.move(box.x + rand(2, 6), box.y + rand(2, 6));
  }
  await waitHuman(rand(40, 160));
  await el.click({ delay: rand(40, 120) });
}

export async function scrollHuman(page: Page) {
  const bursts = Math.floor(rand(1, 3));
  for (let i = 0; i < bursts; i++) {
    await page.mouse.wheel(0, rand(300, 900));
    await waitHuman(rand(250, 800));
  }
}

export async function selectHuman(page: Page, sel: string, value: string) {
  await clickHuman(page, sel);
  await waitHuman(rand(200, 500));
  await page.selectOption(sel, value);
  await waitHuman(rand(100, 300));
}

export async function fillHuman(page: Page, sel: string, text: string, wpm = 42) {
  await clickHuman(page, sel);
  await waitHuman(rand(100, 300));
  await typeHuman(page, sel, text, wpm);
  await waitHuman(rand(200, 500));
}
