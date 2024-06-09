import {expect, test} from '@playwright/test';

test('has temporary userName', async ({browser}) => {// Create a new page inside context.
    const context = await browser.newContext({locale: 'en'});
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('_vue=UserButton').locator('sup')).toHaveClass(/is-dot/)

});

test('existing context does not have temporary userName', async ({browser}) => {// Create a new page inside context.
    const context = await browser.newContext({
        locale: 'fr',
        storageState: {
            cookies: [],
            origins: [{
                origin: 'http://127.0.0.1:3210',
                localStorage: [{
                    name: 'userName',
                    value: 'toto'
                }]
            }]
        }
    });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('_vue=UserButton').locator('sup')).not.toHaveClass(/is-dot/)

});

test('get started link', async ({page}) => {
    await page.goto('https://playwright.dev/');

    // Click the get started link.
    await page.getByRole('link', {name: 'Get started'}).click();

    // Expects page to have a heading with the name of Installation.
    await expect(page.getByRole('heading', {name: 'Installation'})).toBeVisible();
});
