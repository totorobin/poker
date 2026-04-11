import {Then, When} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {CustomWorld} from '../support/hooks';

When('{string} règle le timer sur {string}', async function (this: CustomWorld, actor: string, timeStr: string) {
    const page = await this.getPage(actor);
    const timePickerInput = page.locator('.timer .el-date-editor input');
    await timePickerInput.waitFor({state: 'visible'});
    await timePickerInput.click();

    // Pour Element Plus, fill() + Enter est souvent la méthode la plus stable pour les tests E2E
    await timePickerInput.fill(timeStr);
    await timePickerInput.press('Enter');

    // Attendre que le dropdown se ferme (s'il y en a un)
    await page.locator('body').click({position: {x: 0, y: 0}});
});

When('{string} démarre le timer', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    // Le bouton de lecture (VideoPlay icon)
    const startButton = page.locator('.timer button').filter({has: page.locator('svg')});
    await startButton.click();
});

Then('{string} et {string} doivent voir le timer tourner', async function (this: CustomWorld, actor1: string, actor2: string) {
    const page1 = await this.getPage(actor1);
    const page2 = await this.getPage(actor2);

    const timerInput1 = page1.locator('.timer .el-date-editor input');
    const timerInput2 = page2.locator('.timer .el-date-editor input');

    // On s'attend à ce que la valeur change (ne soit plus 00:00:10)
    // On utilise expect.poll ou on attend que la valeur change
    await expect(timerInput1).not.toHaveValue('00:00:10', {timeout: 10000});
    await expect(timerInput2).not.toHaveValue('00:00:10', {timeout: 10000});
});

Then('quand le temps est écoulé {string} et {string} doivent voir une notification {string}', async function (this: CustomWorld, actor1: string, actor2: string, message: string) {
    const page1 = await this.getPage(actor1);
    const page2 = await this.getPage(actor2);

    // On attend que la boîte de dialogue de fin de timer apparaisse
    const dialog1 = page1.locator('.el-dialog .msg-end-timer');
    const dialog2 = page2.locator('.el-dialog .msg-end-timer');

    // On augmente le timeout pour cette étape car on a mis 10s dans le scénario
    await expect(dialog1).toContainText(message, {timeout: 20000});
    await expect(dialog2).toContainText(message, {timeout: 20000});
});
