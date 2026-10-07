import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function scan(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  const summary = results.violations
    .map((v) => `${v.impact}: ${v.id} (${v.nodes.length})`)
    .join(' | ');
  console.log(`[axe] ${label}: ${summary || '0 violaciones'}`);
  expect(results.violations, `Violaciones axe en ${label}`).toEqual([]);
}

test('Home', async ({ page }) => {
  await page.goto('/');
  await scan(page, 'home');
});

test('Catálogo', async ({ page }) => {
  await page.goto('/#/catalogo');
  await scan(page, 'catalogo');
});

test('Abrir DirectConsultasModal', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Verificadores y Consultas en Línea', { exact: true }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await scan(page, 'DirectConsultasModal');
});

test('Abrir GuidedProcessModal', async ({ page }) => {
  await page.goto('/');
  await page.locator('div.group:has-text("Guía paso a paso para")').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await scan(page, 'GuidedProcessModal');
});

test('Abrir TramiteDetailModal', async ({ page }) => {
  await page.goto('/#/catalogo');
  await page.locator('main div[aria-label]:has-text("Ver detalle")').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await scan(page, 'TramiteDetailModal');
});

test('Abrir UserWayAccessibilityModal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir panel de accesibilidad' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await scan(page, 'UserWayAccessibilityModal');
});