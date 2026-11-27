export type InterestRole = 'DISTRIBUTOR' | 'DESIGNER' | 'BUYER';

export interface CreateLeadPayload {
  fullName: string;
  email: string;
  interestRole: InterestRole;
  message: string;
  consentGiven: boolean;
}

export interface LeadDTO {
  id: string;
  fullName: string;
  email: string;
  interestRole: string;
  message: string;
  status: string;
  source: string;
  catalogDispatched: boolean;
  createdAt: string;
}
