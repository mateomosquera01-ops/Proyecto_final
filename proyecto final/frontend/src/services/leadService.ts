import { CreateLeadPayload, LeadDTO } from '../types/lead';
import { apiRequest } from './api';

export const leadService = {
  create(payload: CreateLeadPayload) {
    return apiRequest<LeadDTO>('/leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getAll() {
    return apiRequest<LeadDTO[]>('/leads');
  },
  updateStatus(id: string, status: string) {
    return apiRequest<LeadDTO>(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/leads/${id}`, {
      method: 'DELETE',
    });
  },
};
