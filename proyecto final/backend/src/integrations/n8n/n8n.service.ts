import { env } from '../../config/environment';
import { N8nDispatchResult, N8nLeadPayload } from './n8n.types';

export class N8nService {
  async sendLeadCatalogWebhook(payload: N8nLeadPayload): Promise<N8nDispatchResult> {
    if (!env.n8nWebhookUrl) {
      return {
        dispatched: false,
        status: 'SKIPPED',
        errorMessage: 'N8N_WEBHOOK_URL no configurado en el entorno del servidor',
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (env.n8nWebhookSecret) {
        headers['X-Textech-Webhook-Secret'] = env.n8nWebhookSecret;
      }

      const response = await fetch(env.n8nWebhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const bodyText = await response.text().catch(() => '');
        return {
          dispatched: false,
          status: 'FAILED',
          errorMessage: `Webhook n8n respondió con estado ${response.status}: ${bodyText.slice(0, 200)}`,
        };
      }

      let providerReference: string | undefined;
      try {
        const json = (await response.json()) as { executionId?: string; messageId?: string };
        providerReference = json.executionId || json.messageId || undefined;
      } catch {
        providerReference = `n8n-http-${response.status}`;
      }

      return {
        dispatched: true,
        status: 'SENT',
        providerReference,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error de red invocando webhook n8n';
      return {
        dispatched: false,
        status: 'FAILED',
        errorMessage,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const n8nService = new N8nService();
