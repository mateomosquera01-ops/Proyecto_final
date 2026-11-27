import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { catalogsService } from './catalogs.service';

export class CatalogsController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const catalogs = await catalogsService.listCatalogs();
    res.status(200).json({
      success: true,
      data: catalogs,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const catalog = await catalogsService.createCatalog(req.body);
    res.status(201).json({
      success: true,
      message: 'Catálogo creado exitosamente',
      data: catalog,
    });
  });
}

export const catalogsController = new CatalogsController();
