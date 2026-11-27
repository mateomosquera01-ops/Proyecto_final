import { Request, Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { productsService } from './products.service';

export class ProductsController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;

    const products = await productsService.listProducts({ search, categoryId, status });
    res.status(200).json({
      success: true,
      data: products,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const product = await productsService.getProductById(String(req.params.id));
    res.status(200).json({
      success: true,
      data: product,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const product = await productsService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const product = await productsService.updateProduct(String(req.params.id), req.body);
    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
    });
  });

  remove = asyncHandler(async (req: Request, res: Response) => {
    await productsService.deleteProduct(String(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente',
    });
  });
}

export const productsController = new ProductsController();
