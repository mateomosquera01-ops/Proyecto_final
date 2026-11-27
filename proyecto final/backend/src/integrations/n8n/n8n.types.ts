export interface N8nLeadPayload {
  leadId: string;
  fullName: string;
  email: string;
  interestRole: string;
  message: string;
  catalogTitle: string;
  catalogPdfUrl: string | null;
  requestedAt: string;
}

export interface N8nDispatchResult {
  dispatched: boolean;
  status: 'SENT' | 'FAILED' | 'SKIPPED';
  providerReference?: string;
  errorMessage?: string;
}
