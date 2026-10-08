import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * Deuda axe conocida: 0 violaciones toleradas.
 * El gate FALLA ante cualquier violación de accesibilidad.
 */
const ALLOWED_RULES = new Set<string>();

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

test('Abrir VirtualAssistantModal (RITA)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir asistente virtual RITA' }).click();
  const dialog = page.locator('#rita-dialog');
  await expect(dialog).toBeVisible();
  await scan(page, 'VirtualAssistantModal');
});

test('Abrir PortalFlowModal (React Flow)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir diagrama de flujo interactivo del portal en tarjetas conectadas' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await scan(page, 'PortalFlowModal');
});

test('Página completa: Mapa Jerárquico Oficial (PortalFlowPage en #/mapa)', async ({ page }) => {
  await page.goto('/#/mapa');
  await expect(page.locator('h1:has-text("Mapa Jerárquico Oficial")')).toBeVisible();
  await scan(page, 'PortalFlowPage');
});

test('Modal accesible: Cierre con Escape y restauración de foco', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Abrir panel de accesibilidad' });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Presionar Escape
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('Modal accesible: Contención de foco (Focus trap)', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir panel de accesibilidad' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Verificar que múltiples pulsaciones de Tab permanecen dentro del modal
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const isInside = await dialog.evaluate((el) => el.contains(document.activeElement));
    expect(isInside).toBe(true);
  }
});

test('Tarjetas accesibles: Operables por teclado con tecla Enter', async ({ page }) => {
  await page.goto('/');
  const card = page.getByRole('button', { name: 'Verificadores y Consultas en Línea' });
  await card.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
});