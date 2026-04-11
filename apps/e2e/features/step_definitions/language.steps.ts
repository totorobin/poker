import {Then, When} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {CustomWorld} from '../support/hooks';

Then('{string} doit voir l\'interface en français', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    // On vérifie le drapeau français dans le bouton de langue
    const langButton = page.locator('.flag');
    await expect(langButton).toContainText('🇫🇷', {timeout: 15000});
});

When('{string} change la langue', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    await page.locator('.flag').click();
});

Then('{string} doit voir l\'interface en anglais', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    const langButton = page.locator('.flag');
    // Le drapeau devient britannique pour indiquer la langue actuelle (en) ou la cible ? 
    // D'après fr.json, "flag" est "🇫🇷" et en.json c'est "🇬🇧"
    await expect(langButton).toContainText('🇬🇧', {timeout: 10000});
});
