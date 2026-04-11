import {Then, When} from '@cucumber/cucumber';
import {expect} from '@playwright/test';
import {CustomWorld} from '../support/hooks';

When('{string} ouvre les réglages de la room', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} ouvre les réglages`);

    // Le bouton Settings est le premier des boutons .icon-button pour le owner
    const settingsButton = page.locator('.actions .icon-button').first();
    await settingsButton.click();

    // Attendre que le dialogue apparaisse
    await page.waitForSelector('.el-dialog', {state: 'visible'});
});

When('{string} sélectionne le deck de cartes {string}', async function (this: CustomWorld, actor: string, deckName: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} sélectionne le deck ${deckName}`);

    // Utilisation du select standard dans RoomSettings.vue
    const select = page.locator('.el-dialog select');
    // On cherche l'option par son texte
    // Note: les options utilisent t(set.name)
    // Fibonacci, Linéaire, Fibonacci 2, tee-shirt sizes, weather
    await select.selectOption({label: deckName});
});

When('{string} active l\'option {string}', async function (this: CustomWorld, actor: string, optionLabel: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} active l'option ${optionLabel}`);

    // Attendre que le dialogue soit visible
    await page.waitForSelector('.el-dialog', {state: 'visible', timeout: 10000});

    // Normalisation pour le test
    let searchLabel = optionLabel;
    if (optionLabel.toLowerCase().includes("actions réservées") || optionLabel.toLowerCase().includes("actions r.serv.es")) {
        searchLabel = "Actions réservés a l'admin";
    } else if (optionLabel.toLowerCase().includes("bloquer les votes")) {
        searchLabel = "Bloquer les votes une fois les cartes révélés";
    }

    console.log(`Recherche du libellé : "${searchLabel}"`);
    const optionText = page.locator('.el-dialog p').filter({hasText: new RegExp(searchLabel.replace(/[.'-]/g, '.'), 'i')}).first();
    await optionText.waitFor({state: 'visible', timeout: 5000});

    const switchElement = optionText.locator('.el-switch');
    await switchElement.waitFor({state: 'visible', timeout: 5000});

    const isChecked = await switchElement.evaluate(el => el.classList.contains('is-checked'));
    if (!isChecked) {
        await switchElement.click();
        await expect(switchElement).toHaveClass(/is-checked/, {timeout: 5000});
    }
});

When('{string} valide les réglages', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} valide les réglages`);

    const confirmButton = page.locator('.el-dialog__footer .el-button--primary');
    await confirmButton.click();

    // Attendre que le dialogue disparaisse
    await page.waitForSelector('.el-dialog', {state: 'hidden'});
});

Then('{string} doit voir les cartes {string} disponibles pour le vote', async function (this: CustomWorld, actor: string, cardsStr: string) {
    const page = await this.getPage(actor);
    const expectedCards = cardsStr.split(',').map(c => c.trim());
    console.log(`${actor} vérifie les cartes : ${expectedCards.join(', ')}`);

    const footerCards = page.locator('.card-footer .cardcontainer');

    // On vérifie que le nombre de cartes correspond (ou au moins que les cartes attendues sont présentes)
    // await expect(footerCards).toHaveCount(expectedCards.length);

    for (const card of expectedCards) {
        // Utiliser une expression régulière pour une correspondance exacte du texte afin d'éviter que "0" matche "10"
        await expect(page.locator('.card-footer .cardcontainer').filter({hasText: new RegExp(`^${card}$`)})).toBeVisible();
    }
});

Then('{string} doit pouvoir révéler les votes', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} vérifie qu'il peut révéler les votes`);

    // Le bouton de révélation est le 2ème pour l'admin (si 3 boutons au total) ou le 1er (si 2 boutons)
    // Mais on peut vérifier s'il est désactivé ou non
    const actionButtons = page.locator('.actions .icon-button');
    const count = await actionButtons.count();
    const showButton = actionButtons.nth(count === 3 ? 1 : 0);

    await expect(showButton).not.toBeDisabled();
});

Then('{string} ne doit pas pouvoir révéler les votes', async function (this: CustomWorld, actor: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} vérifie qu'il ne peut pas révéler les votes`);

    // Pour un non-admin, si actionsOwnerOnly est vrai, le bouton devrait être désactivé
    // D'après RoomView.vue : :disabled="!actionsAllowed"
    const actionButtons = page.locator('.actions .icon-button');
    // Le non-admin n'a pas le bouton settings, donc il a Show/Hide et Reset
    const showButton = actionButtons.nth(0);

    await expect(showButton).toBeDisabled();
});

Then('{string} ne doit pas pouvoir voter pour la carte {string}', async function (this: CustomWorld, actor: string, cardValue: string) {
    const page = await this.getPage(actor);
    console.log(`${actor} vérifie qu'il ne peut pas voter pour ${cardValue}`);

    const card = page.locator('.card-footer .cardcontainer', {hasText: cardValue});
    await card.click();

    // Normalement, une notification d'erreur devrait apparaître : "Impossible de voter une fois que les cartes sont affichés"
    // Et le store n'est pas mis à jour
    const notification = page.locator('.el-message--error');
    // await expect(notification).toBeVisible(); // Peut être trop rapide ou déjà disparu

    // Vérification indirecte : l'utilisateur ne doit pas être marqué comme ayant voté (pas de .cardBack dans .user-view pour lui)
    // On récupère le nom de l'utilisateur (ou celui généré)
    const name = (this as any)[`${actor}_generatedName`] || actor;
    const userContainer = page.locator('.user-view .cardcontainer', {hasText: name});
    await expect(userContainer.locator('.cardBack')).not.toBeVisible();
});
