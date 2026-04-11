import {After, Before, setDefaultTimeout, setWorldConstructor, World} from '@cucumber/cucumber';
import {Browser, BrowserContext, chromium, Page} from '@playwright/test';

setDefaultTimeout(30000);

export class CustomWorld extends World {
    browser?: Browser;
    context?: BrowserContext;
    pages: Record<string, Page> = {};

    async init() {
        this.browser = await chromium.launch({headless: true});
    }

    async getPage(name: string): Promise<Page> {
        if (!this.pages[name]) {
            const context = await this.browser!.newContext();
            const page = await context.newPage();

            // Relayer les messages de la console du navigateur vers le terminal
            page.on('console', msg => {
                console.log(`[BROWSER ${name}] ${msg.type().toUpperCase()}: ${msg.text()}`);
            });

            this.pages[name] = page;
        }
        return this.pages[name];
    }

    async close() {
        for (const page of Object.values(this.pages)) {
            await page.close();
        }
        await this.browser?.close();
    }
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
    await this.init();
});

After(async function (this: CustomWorld, scenario) {
    if (scenario.result?.status !== 'PASSED') {
        for (const [name, page] of Object.entries(this.pages)) {
            if (!page.isClosed()) {
                try {
                    const image = await page.screenshot({fullPage: true});
                    this.attach(image, 'image/png');
                    console.log(`[SCREENSHOT] Capture d'écran prise pour ${name} suite à l'échec`);
                } catch (e) {
                    console.error(`[ERROR] Impossible de prendre une capture d'écran pour ${name}:`, e);
                }
            }
        }
    }
    await this.close();
});
