import {Given, Then} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {CustomWorld} from '../support/hooks';

const BASE_URL = 'http://localhost:5173';

Given('l\'utilisateur {string} se connecte à la room {string}', async function (this: CustomWorld, userName: string, roomName: string) {
    const page = await this.getPage(userName);

    console.log(`Navigation vers ${BASE_URL} pour ${userName}`);
    // Aller sur la page d'accueil
    await page.goto(`${BASE_URL}`);

    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');

    console.log(`Attente de l'élément .user pour ${userName}`);
    // Cliquer sur le bouton utilisateur pour définir son nom
    const userButton = page.locator('.user');

    await userButton.waitFor({state: 'visible', timeout: 5000});
    const text = await userButton.textContent();
    console.log(`Element .user visible pour ${userName} (contenu: "${text?.trim()}"), clic en cours...`);
    await userButton.click();

    console.log(`Saisie du nom ${userName}`);
    const input = page.locator('.el-message-box__input input, input.el-message-box__input');

    await input.waitFor({state: 'visible', timeout: 5000});
    console.log(`Input dialog visible pour ${userName}, remplissage...`);
    await input.fill(userName);

    const confirmButton = page.locator('.el-message-box__btns button.el-button--primary');
    console.log(`Clic sur le bouton de confirmation pour ${userName}`);
    await confirmButton.click();

    // Attendre que le dialogue se ferme
    console.log(`Attente de la fermeture du dialogue pour ${userName}`);
    await input.waitFor({state: 'hidden'});

    console.log(`Recherche du champ room id pour ${userName}`);
    // Rejoindre la room
    const roomInput = page.locator('input[placeholder="room id"]');
    await roomInput.waitFor({state: 'visible'});
    await roomInput.fill(roomName);
    await roomInput.press('Enter');

    // Attendre que l'URL change ou que la room soit chargée
    await expect(page).toHaveURL(new RegExp(`/room/${roomName}$`));
    // On attend que la vue de la room s'affiche
    await page.waitForSelector('.user-view', {state: 'visible'});
});

Then('{string} doit voir que {string} est présent dans la room', async function (this: CustomWorld, observer: string, observed: string) {
    const page = await this.getPage(observer);

    // Vérifier que le nom de l'autre utilisateur est présent dans .user-view
    // Dans RoomView.vue : <div class="user-view"><el-row>...{{ user.name }}</el-col></el-row></div>
    const userView = page.locator('.user-view');
    await expect(userView).toContainText(observed);
});
