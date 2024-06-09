import {expect, test} from '@playwright/test';

test('Two people in a room', async ({browser}) => {
    // 1er utilisateur sur la page
    const context_user1 = await browser.newContext({
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
    const page_u1 = await context_user1.newPage();
    page_u1.on('websocket', ws => {
        console.log(`WebSocket opened: ${ws.url()}>`);
        ws.on('framesent', event => console.log(event));
    })
    await page_u1.goto('/room/test-room-1');
    await expect(page_u1.getByTestId('user-card').filter({hasText: 'toto'})).toHaveCount(1)
    await expect(page_u1.getByTestId('user-card')).toHaveCount(1)
    await expect(page_u1.locator('.el-message').last()).toContainText('toto a rejoint la salle')
    // 2eme utilisateur arrive sur la page
    const context_user2 = await browser.newContext({
        locale: 'fr',
        storageState: {
            cookies: [],
            origins: [{
                origin: 'http://127.0.0.1:3210',
                localStorage: [{
                    name: 'userName',
                    value: 'tata'
                }]
            }]
        }
    });
    const page_u2 = await context_user2.newPage();
    await page_u2.goto('/room/test-room-1');
    await expect(page_u2.getByTestId('user-card').filter({hasText: 'tata'})).toHaveCount(1)
    await expect(page_u2.getByTestId('user-card')).toHaveCount(2)
    await expect(page_u2.locator('.el-message').last()).toContainText('tata a rejoint la salle')
    await expect(page_u1.getByTestId('user-card')).toHaveCount(2)
    await expect(page_u1.locator('.el-message').last()).toContainText('tata a rejoint la salle')

    // 1er utilisateur vote
    await page_u1.getByTestId('voting-card').getByText('3', {exact: true}).click()
    await expect(page_u1.getByTestId('user-card').filter({hasText: 'toto'}).locator('.card')).toContainText('3')
    await expect(page_u2.getByTestId('user-card').filter({hasText: 'toto'}).locator('.card')).toHaveCount(1)

    await expect(page_u2.locator('.el-message').last()).toContainText('toto a voté')


    // 2eme utilisateur vote
    await page_u2.getByTestId('voting-card').getByText('5', {exact: true}).click()
    await expect(page_u2.getByTestId('user-card').filter({hasText: 'tata'}).locator('.card')).toContainText('5')
    await expect(page_u1.getByTestId('user-card').filter({hasText: 'tata'}).locator('.card')).toHaveCount(1)

    // dernier message contient 'Tout le monde a voté'
    await expect(page_u1.locator('.el-message').last()).toContainText('Tout le monde a voté')

});