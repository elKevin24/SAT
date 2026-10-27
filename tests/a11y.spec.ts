import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * Deuda axe conocida: 0 violaciones toleradas.
 * El gate FALLA ante cualquier violación de accesibilidad.
 */
const ALLOWED_RULES = new Set<string>();

async function scan(page: Page, label: string) {
  await page.waitForTimeout(250);
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

test('Página Solicitar NIT (#/solicitar-nit)', async ({ page }) => {
  await page.goto('/#/solicitar-nit');
  await expect(page.getByRole('heading', { name: /Solicitar.*NIT/i })).toBeVisible();
  await scan(page, 'SolicitarNitPage');
});

test('Página Factura Electrónica FEL (#/fel)', async ({ page }) => {
  await page.goto('/#/fel');
  await expect(page.getByRole('heading', { name: /^Factura Electrónica en Línea/i })).toBeVisible();
  await scan(page, 'FelPage');
});

test('Abrir DirectConsultasModal', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Verificadores y Consultas en Línea', { exact: true }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await scan(page, 'DirectConsultasModal');
});

test('Navegación a Proceso Guiado (ProcessJourneyPage)', async ({ page }) => {
  await page.goto('/#/proceso/2');
  await expect(page.locator('h1')).toBeVisible();
  await scan(page, 'ProcessJourneyPage');
});

test('Navegación a página de contenido de gestión (GestionContentPage)', async ({ page }) => {
  await page.goto('/#/catalogo');
  await page.getByRole('button', { name: 'Sin Obligaciones' }).first().click();
  await page.getByRole('button', { name: /Solicitud y Activación de Agencia Virtual/i }).first().click();
  await expect(page.locator('h1')).toBeVisible();
  await scan(page, 'GestionContentPage');
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

test('Página completa: Mapa Jerárquico Oficial (PortalFlowPage en #/mapa)', async ({ page }) => {
  await page.goto('/#/mapa');
  await expect(page.locator('h1:has-text("Mapa Jerárquico Oficial")')).toBeVisible();
  await scan(page, 'PortalFlowPage');
});

test('Modal accesible: Cierre con Escape y restauración de foco', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Abrir panel de accesibilidad' });
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Presionar Escape
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  const root = page.locator('#root');
  await expect(root).not.toHaveAttribute('aria-hidden', 'true');
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
  // Shift+Tab también permanece dentro
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Shift+Tab');
    const isInside = await dialog.evaluate((el) => el.contains(document.activeElement));
    expect(isInside).toBe(true);
  }
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      localStorage.clear();
    } catch {}
  });
});

test('Tarjetas accesibles: Operables por teclado con tecla Enter', async ({ page }) => {
  await page.goto('/');
  const card = page.getByRole('button', { name: 'Verificadores y Consultas en Línea' });
  await card.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
});

test('Reflow y Responsive 320px (WCAG 1.4.10): Cero desbordamiento horizontal en móvil compacto', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  for (const route of ['/', '/#/catalogo', '/#/solicitar-nit']) {
    await page.goto(route);
    await page.waitForTimeout(200);
    const hasHorizontalScroll = await page.evaluate(() => {
      window.scrollTo(100, 0);
      return window.scrollX > 0;
    });
    expect(hasHorizontalScroll, `Scroll horizontal activo en ${route} a 320px`).toBe(false);
  }
});
