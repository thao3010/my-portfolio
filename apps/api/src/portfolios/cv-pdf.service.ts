import {
  Injectable,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Browser } from 'puppeteer';

async function loadPuppeteer() {
  const mod = await import('puppeteer');
  return mod.default;
}

@Injectable()
export class CvPdfService implements OnModuleDestroy {
  private browser: Browser | null = null;
  private launching: Promise<Browser> | null = null;

  async onModuleDestroy(): Promise<void> {
    await this.browser?.close();
    this.browser = null;
    this.launching = null;
  }

  async renderHtmlToPdf(html: string): Promise<Buffer> {
    let page;
    try {
      const browser = await this.getBrowser();
      page = await browser.newPage();
      await page.setContent(html, {
        waitUntil: 'load',
        timeout: 30_000,
      });
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(
          images.map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete) {
                  resolve();
                  return;
                }
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener('error', () => resolve(), { once: true });
              }),
          ),
        );
      });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '16mm',
          bottom: '16mm',
          left: '14mm',
          right: '14mm',
        },
      });
      return Buffer.from(pdf);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'PDF generation failed';
      throw new ServiceUnavailableException(
        `Could not generate CV PDF (${message}). Ensure Chromium is available for the API.`,
      );
    } finally {
      await page?.close().catch(() => undefined);
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (this.browser?.connected) {
      return this.browser;
    }
    if (this.launching) {
      return this.launching;
    }
    this.launching = loadPuppeteer()
      .then((puppeteer) =>
        puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }),
      )
      .then((browser) => {
        this.browser = browser;
        this.launching = null;
        return browser;
      })
      .catch((err) => {
        this.launching = null;
        throw err;
      });
    return this.launching;
  }
}
