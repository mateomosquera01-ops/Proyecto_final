import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { leadsService } from './leads.service';

export class LeadsController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.createLead(req.body, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    res.status(201).json({
      success: true,
      message: 'Solicitud registrada exitosamente. Revisa tu correo para acceder al catálogo Textech.',
      data: lead,
    });
  });

  list = asyncHandler(async (_req: Request, res: Response) => {
    const leads = await leadsService.listLeads();
    res.status(200).json({
      success: true,
      data: leads,
    });
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const updated = await leadsService.updateLeadStatus(String(req.params.id), req.body.status);
    res.status(200).json({
      success: true,
      message: 'Estado del lead actualizado',
      data: updated,
    });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await leadsService.deleteLead(String(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Lead eliminado correctamente',
    });
  });
}

export const leadsController = new LeadsController();
