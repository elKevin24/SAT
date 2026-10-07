import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * Deuda axe conocida y documentada (ver ROADMAP-AUDITORIA.md, gate de Fase 0b.6).
 * Las reglas permitidas NO se ignoran: se reportan en el resumen y deben
 * desaparecer en la fase indicada. El gate FALLA ante cualquier violación nueva.
 *
 * - heading-order: los títulos de tarjeta se renderizan como h4 bajo h1/h2
 *   (ui/Card.tsx:97, tarjetas de segmento y banner). Se corrige en Fase 1
 *   añadiendo la prop `headingLevel` a ui/Card (h3 en secciones bajo h2).
 *   Cuando se haga, retirar esta entrada: el gate verificará el arreglo.
 */
const ALLOWED_RULES = new Set(['heading-order']);

async function scan(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  const blocker = results.violations.filter((v) => !ALLOWED_RULES.has(v.id));
  const summary = results.violations
    .map((v) =>
      `${v.impact}: ${v.id} (${v.nodes.length})${ALLOWED_RULES.has(v.id) ? ' [deuda conocida]' : ''}`
    )
    .join(' | ');
  console.log(`[axe] ${label}: ${summary || '0 violaciones'}`);
  expect(
    blocker,
    `Violaciones axe NUEVAS en ${label}: ${blocker.map((b) => b.id).join(', ')}`
  ).toEqual([]);
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
  await page.getByRole('button', { name: 'NIT sin Obligaciones' }).first().click();
  await page.getByRole('button', { name: 'Inscripción de NIT' }).first().click();
  await page.locator('[role="button"]:has-text("Ver detalle")').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await scan(page, 'TramiteDetailModal');
});

test('Abrir UserWayAccessibilityModal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir panel de accesibilidad' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await scan(page, 'UserWayAccessibilityModal');
});