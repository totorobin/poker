import {Given, Then, When} from '@cucumber/cucumber';
import {expect, Page} from '@playwright/test';
import {CustomWorld} from '../support/hooks';

const BASE_URL = 'http://localhost:5173';

async function joinRoom(page: Page, roomName: string) {
    console.log(`Recherche du champ room id`);
    const roomInput = page.locator('input[placeholder="room id"]');
    await roomInput.waitFor({state: 'visible'});
    await roomInput.fill(roomName);
    await roomInput.press('Enter');

    // Attendre que l'URL change ou que la room soit chargée
    await expect(page).toHaveURL(new RegExp(`/room/${roomName}$`));
    // On attend que la vue de la room s'affiche
    await page.waitForSelector('.user-view', {state: 'visible'});
}

Given('l\'utilisateur {string} se connecte à la room {string} avec le nom pré-enregistré {string}', async function (this: CustomWorld, actor: string, roomName: string, userName: string) {
    const page = await this.getPage(actor);

    console.log(`Navigation vers ${BASE_URL} pour ${actor} avec le nom pré-enregistré ${userName}`);
    // Simuler le localStorage avant de charger la page
    await page.addInitScript((name) => {
        window.localStorage.setItem('userName', name);
    }, userName);

    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState('networkidle');

    // Vérifier que le nom est bien affiché dans le bouton .user
    const userButton = page.locator('.user');
    await expect(userButton).toContainText(userName);

    await joinRoom(page, roomName);
});

Given('l\'utilisateur {string} se connecte à la room {string} et saisit son nom {string}', async function (this: CustomWorld, actor: string, roomName: string, userName: string) {
    const page = await this.getPage(actor);

    console.log(`Navigation vers ${BASE_URL} pour ${actor} en saisissant le nom ${userName}`);
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState('networkidle');

    console.log(`Attente de l'élément .user pour ${actor}`);
    const userButton = page.locator('.user');
    await userButton.waitFor({state: 'visible', timeout: 5000});
    await userButton.click();

    console.log(`Saisie du nom ${userName}`);
    const input = page.locator('.el-message-box__input input, input.el-message-box__input');
    await input.waitFor({state: 'visible', timeout: 5000});
    await input.fill(userName);

    const confirmButton = page.locator('.el-message-box__btns button.el-button--primary');
    await confirmButton.click();
    await input.waitFor({state: 'hidden'});

    await joinRoom(page, roomName);
});

Given('l\'utilisateur {string} se connecte à la room {string} avec le nom généré par défaut', async function (this: CustomWorld, actor: string, roomName: string) {
    const page = await this.getPage(actor);

    console.log(`Navigation vers ${BASE_URL} pour ${actor} avec le nom généré`);
    await page.goto(`${BASE_URL}`);
    await page.waitForLoadState('networkidle');

    // On ne fait rien pour le nom, on rejoint direct la room
    await joinRoom(page, roomName);

    // On récupère le nom généré pour plus tard si besoin
    const userButton = page.locator('.user');
    const name = (await userButton.textContent())?.trim();
    console.log(`Nom généré pour ${actor} : ${name}`);
    // Stocker le nom généré dans le world pour les étapes de validation
    (this as any)[`${actor}_generatedName`] = name;
});

Then('{string} doit voir que {string} et {string} sont présents dans la room', async function (this: CustomWorld, observer: string, user1: string, user2: string) {
    const page = await this.getPage(observer);
    const userView = page.locator('.user-view');

    const getName = (actor: string) => {
        return (this as any)[`${actor}_generatedName`] || actor;
    };

    const name1 = getName(user1);
    const name2 = getName(user2);

    console.log(`${observer} vérifie la présence de ${name1} et ${name2}`);
    await expect(userView).toContainText(name1);
    await expect(userView).toContainText(name2);
});

When('{string} vote pour la carte {string}', async function (this: CustomWorld, actor: string, cardValue: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} vote pour la carte ${cardValue}`);
    // Les cartes de vote sont dans .card-footer .cardcontainer
    const card = page.locator(`.card-footer .cardcontainer:has-text("${cardValue}")`).first();
    await card.waitFor({state: 'visible'});
    await card.click();
});

Then('{string} doit voir que {string} et {string} ont voté', async function (this: CustomWorld, observer: string, user1: string, user2: string) {
    const page = await this.getPage(observer);

    const getName = (actor: string) => {
        return (this as any)[`${actor}_generatedName`] || actor;
    };

    const name1 = getName(user1);
    const name2 = getName(user2);

    console.log(`${observer} vérifie que ${name1} et ${name2} ont voté (carte de dos)`);

    // On cherche le conteneur du joueur par son nom, puis on vérifie qu'il y a une carte de dos (.cardBack)
    const player1Container = page.locator(`.user-view .cardcontainer`, {hasText: name1});
    const player2Container = page.locator(`.user-view .cardcontainer`, {hasText: name2});

    await expect(player1Container.locator('.cardBack')).toBeVisible();
    await expect(player2Container.locator('.cardBack')).toBeVisible();
});

When('{string} révèle les votes', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} révèle les votes`);
    // On attend que les boutons soient là
    await page.waitForSelector('.actions .icon-button', {state: 'visible'});

    // Le bouton avec le tooltip tooltips.show (View icon)
    // On cherche le bouton qui contient l'icône de visibilité (View)
    // Comme il n'y a pas d'aria-label simple, on peut essayer de cliquer sur le bouton qui a l'icône View
    // Ou simplement le bouton d'action (Révéler/Cacher)
    const actionButtons = page.locator('.actions .icon-button');
    const count = await actionButtons.count();
    console.log(`Nombre de boutons d'action trouvés : ${count}`);

    // D'après RoomView.vue, si Alice est proprio, elle a 3 boutons : Settings, Show/Hide, Reset
    // Si elle n'est pas proprio, elle a Show/Hide, Reset (si actionsOwnerOnly est false)
    // On va chercher le bouton qui n'est PAS le bouton settings (qui a l'icône Setting)
    // Le bouton Show/Hide est celui qui change entre View et Hide.

    // Approche plus simple : cliquer sur le bouton qui contient l'icône 'svg' (tous les boutons icon-button en ont)
    // et qui n'est pas le dernier (reset) ni le premier (settings si présent)

    // Si Alice a créé la room, elle est owner.
    const showButton = actionButtons.nth(count === 3 ? 1 : 0);
    await showButton.click();

    // Attendre que le changement soit pris en compte (le bouton devrait changer d'icône)
    await page.waitForTimeout(1000);
});

Then('{string} doit voir que {string} a voté {string} et {string} a voté {string}', async function (this: CustomWorld, observer: string, user1: string, val1: string, user2: string, val2: string) {
    const page = await this.getPage(observer);

    const getName = (actor: string) => {
        return (this as any)[`${actor}_generatedName`] || actor;
    };

    const name1 = getName(user1);
    const name2 = getName(user2);

    console.log(`${observer} vérifie les votes révélés : ${name1}=${val1}, ${name2}=${val2}`);

    const player1Container = page.locator(`.user-view .cardcontainer`, {hasText: name1});
    const player2Container = page.locator(`.user-view .cardcontainer`, {hasText: name2});

    // On attend un peu que l'animation de transition se termine si nécessaire
    // ou on utilise un sélecteur plus robuste qui attend le texte
    await expect(player1Container.locator('.cardFront')).toContainText(val1, {timeout: 10000});
    await expect(player2Container.locator('.cardFront')).toContainText(val2, {timeout: 10000});
});

When('{string} cache les votes', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} cache les votes`);
    const actionButtons = page.locator('.actions .icon-button');
    const count = await actionButtons.count();
    const hideButton = actionButtons.nth(count === 3 ? 1 : 0);
    await hideButton.click();
    await page.waitForTimeout(1000);
});

Then('{string} doit voir que les votes de {string} et {string} sont cachés', async function (this: CustomWorld, observer: string, user1: string, user2: string) {
    const page = await this.getPage(observer);

    const getName = (actor: string) => {
        return (this as any)[`${actor}_generatedName`] || actor;
    };

    const name1 = getName(user1);
    const name2 = getName(user2);

    console.log(`${observer} vérifie que les votes de ${name1} et ${name2} sont à nouveau cachés`);

    const player1Container = page.locator(`.user-view .cardcontainer`, {hasText: name1});
    const player2Container = page.locator(`.user-view .cardcontainer`, {hasText: name2});

    await expect(player1Container.locator('.cardBack')).toBeVisible();
    await expect(player2Container.locator('.cardBack')).toBeVisible();
});

When('{string} efface les votes', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} efface les votes (reset)`);
    // On s'assure que les boutons sont chargés
    await page.waitForSelector('.actions .icon-button', {state: 'visible'});
    const actionButtons = page.locator('.actions .icon-button');
    const count = await actionButtons.count();
    console.log(`Reset: Nombre de boutons d'action trouvés : ${count}`);

    // Le bouton reset est le dernier .icon-button dans .actions
    const resetButton = actionButtons.last();
    await resetButton.click();
    await page.waitForTimeout(1000);
});

Then('{string} doit voir que personne n\'a voté', async function (this: CustomWorld, observer: string) {
    const page = await this.getPage(observer);
    console.log(`${observer} vérifie que personne n'a voté`);
    // Dans RoomView.vue, si user.card est null, GameCard a la classe .unset
    // Et .cardBack/.cardFront ne sont pas présentes (car cardValue est null)
    const userView = page.locator('.user-view');
    await expect(userView.locator('.cardBack')).toHaveCount(0);
    await expect(userView.locator('.cardFront')).toHaveCount(0);
});
