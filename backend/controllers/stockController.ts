import { NextFunction, Request, Response } from "express";
import ResponseDTO from "../dtos/response.dto.js";
import stockMovementService from "../services/stockMovementService.js";
import { MovementType } from "../models/StockMovement.js";
import { OverallError } from "../errors/orderSaveError.js";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { validate } from "class-validator";
import { StockAdjustDto } from "../dtos/stock.dto.js";

class StockController {
  async getMovementHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const inventoryId = Number(req.params.inventoryId);
      if (isNaN(inventoryId)) {
        throw new OverallError("شناسه موجودی نامعتبر است", 400);
      }
      const movements = await stockMovementService.getMovementHistory(inventoryId);
      return res
        .status(200)
        .json(new ResponseDTO(null, null, true, null, instanceToPlain(movements)));
    } catch (error) {
      next(error);
    }
  }

  async adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req["user"];
      const adjustDto = plainToInstance(StockAdjustDto, req.body);
      const errors = await validate(adjustDto);
      if (errors.length > 0) {
        throw new OverallError("داده‌های ورودی نامعتبر است", 400);
      }
      const movement = await stockMovementService.recordMovement(
        adjustDto.inventoryId,
        MovementType.MANUAL_ADJUSTMENT,
        adjustDto.quantityChange,
        adjustDto.reason,
        user.id
      );
      return res
        .status(200)
        .json(
          new ResponseDTO(
            null,
            null,
            true,
            "موجودی با موفقیت اصلاح شد",
            instanceToPlain(movement)
          )
        );
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const threshold = req.query.threshold
        ? Number(req.query.threshold)
        : undefined;
      const items = await stockMovementService.getLowStockItems(threshold);
      return res
        .status(200)
        .json(new ResponseDTO(null, null, true, null, instanceToPlain(items)));
    } catch (error) {
      next(error);
    }
  }

  async getSlowMoving(req: Request, res: Response, next: NextFunction) {
    try {
      const dateRangeInMonths = req.query.months
        ? Number(req.query.months)
        : 3;
      const salesThreshold = req.query.threshold
        ? Number(req.query.threshold)
        : 1;
      const items = await stockMovementService.getSlowMovingItems(
        dateRangeInMonths,
        salesThreshold
      );
      return res
        .status(200)
        .json(new ResponseDTO(null, null, true, null, instanceToPlain(items)));
    } catch (error) {
      next(error);
    }
  }
}

export default new StockController();
