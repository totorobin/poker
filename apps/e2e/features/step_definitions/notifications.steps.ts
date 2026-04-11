import {Then, When} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {CustomWorld} from '../support/hooks';

When('{string} change son nom en {string}', async function (this: CustomWorld, actor: string, newName: string) {
    const page = await this.getPage(actor);
    const userButton = page.locator('.user');
    await userButton.waitFor({state: 'visible'});
    await userButton.click();

    const input = page.locator('.el-message-box__input input, input.el-message-box__input');
    await input.waitFor({state: 'visible'});
    await input.fill(newName);

    const confirmButton = page.locator('.el-message-box__btns button.el-button--primary');
    await confirmButton.click();
    await input.waitFor({state: 'hidden'});
});

Then('{string} doit voir une notification indiquant que {string} s\'appelle maintenant {string}', async function (this: CustomWorld, observer: string, oldName: string, newName: string) {
    const page = await this.getPage(observer);
    // Le message est "{oldName} se fait maintenant appeler {name}"
    const expectedText = `${oldName} se fait maintenant appeler ${newName}`;
    const notification = page.locator('.el-message').filter({hasText: expectedText});
    // On augmente le timeout pour la CI
    await expect(notification).toBeVisible({timeout: 10000});
});

Then('{string} doit voir une notification indiquant que tout le monde a voté', async function (this: CustomWorld, observer: string) {
    const page = await this.getPage(observer);
    const notification = page.locator('.el-message').filter({hasText: /Tout le monde a vot./});
    await expect(notification).toBeVisible({timeout: 10000});
});

When('{string} tente de révéler les cartes', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    const showButton = page.locator('button[title="Afficher"], button:has(.i-mdi-eye), .actions .icon-button').nth(1);
    await showButton.click({force: true});
});

Then('{string} doit voir une notification indiquant que {string} a tenté de tricher', async function (this: CustomWorld, observer: string, cheaterName: string) {
    const page = await this.getPage(observer);
    const expectedText = `Attention ${cheaterName} tente de tricher !`;
    const notification = page.locator('.el-message').filter({hasText: expectedText});
    await expect(notification).toBeVisible({timeout: 10000});
});
