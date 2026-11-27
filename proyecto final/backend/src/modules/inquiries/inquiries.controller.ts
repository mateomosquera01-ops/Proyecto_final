import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { inquiriesService } from './inquiries.service';

export class InquiriesController {
  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const inquiry = await inquiriesService.createInquiry(req.body, req.user?.sub);
    res.status(201).json({
      success: true,
      message: 'Consulta de cotización enviada exitosamente',
      data: inquiry,
    });
  });

  list = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
    const inquiries = await inquiriesService.listInquiries();
    res.status(200).json({
      success: true,
      data: inquiries,
    });
  });

  updateStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const updated = await inquiriesService.updateStatus(
      String(req.params.id),
      req.body,
      req.user?.sub,
    );
    res.status(200).json({
      success: true,
      message: 'Estado de consulta actualizado',
      data: updated,
    });
  });
}

export const inquiriesController = new InquiriesController();
