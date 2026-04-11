import {After, AfterAll, Before, setDefaultTimeout, setWorldConstructor, World} from '@cucumber/cucumber';
import {Browser, chromium, Page} from '@playwright/test';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';

setDefaultTimeout(30000);

const COVERAGE_DIR = path.join(__dirname, '../../.nyc_output');

export class CustomWorld extends World {
    browser?: Browser;
    pages: Record<string, Page> = {};

    async init() {
        this.browser = await chromium.launch({headless: true});
    }

    async getPage(name: string): Promise<Page> {
        if (!this.pages[name]) {
            const context = await this.browser!.newContext();
            const page = await context.newPage();

            // Forcer la langue en français pour les tests E2E
            await page.addInitScript(() => {
                localStorage.setItem('locale', 'fr');
            });

            // Relayer les messages de la console du navigateur vers le terminal
            page.on('console', msg => {
                console.log(`[BROWSER ${name}] ${msg.type().toUpperCase()}: ${msg.text()}`);
            });

            this.pages[name] = page;
        }
        return this.pages[name];
    }

    async close() {
        // Collecte de la couverture avant de fermer les pages
        if (process.env.VITE_COVERAGE === 'true') {
            for (const [name, page] of Object.entries(this.pages)) {
                if (!page.isClosed()) {
                    const coverage = await page.evaluate(() => (window as any).__coverage__);
                    if (coverage) {
                        const coverageFile = path.join(COVERAGE_DIR, `client-${name}-${Date.now()}.json`);
                        await fs.ensureDir(COVERAGE_DIR);
                        await fs.writeJson(coverageFile, coverage);
                        console.log(`[COVERAGE] Couverture client enregistrée pour ${name}`);
                    }
                }
            }
        }

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

AfterAll(async function () {
    if (process.env.VITE_COVERAGE === 'true') {
        try {
            // Un petit délai pour laisser le serveur respirer
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('[COVERAGE] Récupération de la couverture serveur...');
            // Utiliser le port 8080 si configuré ainsi
            const serverUrl = 'http://localhost:3000/coverage';
            const response = await axios.get(serverUrl, {timeout: 5000});
            if (response.data && response.data.coverage) {
                const coverageFile = path.join(COVERAGE_DIR, `server-${Date.now()}.json`);
                await fs.ensureDir(COVERAGE_DIR);
                await fs.writeJson(coverageFile, response.data.coverage);
                console.log('[COVERAGE] Couverture serveur enregistrée');
            }
        } catch (e) {
            console.error('[ERROR] Impossible de récupérer la couverture du serveur:', (e as Error).message);
            // On tente une seconde fois sur le port 8080 au cas où
            try {
                const response = await axios.get('http://localhost:8080/coverage', {timeout: 2000});
                if (response.data && response.data.coverage) {
                    const coverageFile = path.join(COVERAGE_DIR, `server-8080-${Date.now()}.json`);
                    await fs.ensureDir(COVERAGE_DIR);
                    await fs.writeJson(coverageFile, response.data.coverage);
                    console.log('[COVERAGE] Couverture serveur enregistrée (port 8080)');
                }
            } catch (e2) {
                // ignore second failure
            }
        }
    }
});
