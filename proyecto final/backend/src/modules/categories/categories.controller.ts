import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { categoriesService } from './categories.service';

export class CategoriesController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoriesService.listCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoriesService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category,
    });
  });
}

export const categoriesController = new CategoriesController();
