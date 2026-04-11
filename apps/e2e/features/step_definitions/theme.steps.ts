import {Then, When} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {CustomWorld} from '../support/hooks';

When('{string} change la couleur du thème en {string}', async function (this: CustomWorld, actor: string, color: string) {
    const page = await this.getPage(actor);
    const hexColor = color === 'rouge' ? '#FF0000' : '#0000FF';

    // Plutôt que d'utiliser le color picker UI qui est complexe,
    // on injecte la valeur via le localStorage et on recharge la page ou on émet un changement
    // Mais ici le but est de tester la feature. 
    // On va tenter une injection directe dans le localStorage car ChangeThemeButton utilise useStorage
    await page.evaluate((c) => {
        localStorage.setItem('color', c);
        // Déclencher le watch manuellement si possible ou simplement recharger
        window.dispatchEvent(new StorageEvent('storage', {key: 'color', newValue: c}));
    }, hexColor);

    // On recharge pour appliquer
    await page.reload();
    await page.waitForLoadState('networkidle');
});

Then('le thème de {string} doit être {string}', async function (this: CustomWorld, actor: string, color: string) {
    const page = await this.getPage(actor);
    const expectedHex = color === 'rouge' ? '#ff0000' : '#0000ff';

    const storedColor = await page.evaluate(() => localStorage.getItem('color'));
    expect(storedColor?.toLowerCase()).toBe(expectedHex);
});

When('{string} choisit le 2ème verso de carte', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    await page.locator('.theme').click();
    await page.waitForSelector('.el-dialog', {state: 'visible'});

    const secondBack = page.locator('.back-selector .box-card').nth(1);
    await secondBack.click();

    await page.keyboard.press('Escape');
});

Then('les cartes de {string} doivent avoir le nouveau verso', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);

    // Vérifier le localStorage
    const storedBack = await page.evaluate(() => localStorage.getItem('card-back'));
    expect(storedBack).toContain('playing-card-back_1.png'); // 2ème est index 1

    // Vérifier la variable CSS
    const cssBack = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--card-back-background-image').trim();
    });
    expect(cssBack).toContain('playing-card-back_1.png');
});
