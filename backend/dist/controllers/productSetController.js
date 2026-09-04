import productSetService from "../services/productSetService.js";
import { OverallError } from "../errors/orderSaveError.js";
class ProductSetController {
    async findProductSet(req, res, next) {
        try {
            const { id } = req.params;
            if (isNaN(Number(id))) {
                throw new OverallError("ست محصولی وجود ندارد");
            }
            res
                .status(200)
                .json(await productSetService.findProductSetById(Number(id)));
        }
        catch (error) {
            next(error);
        }
    }
    async getAvailableColors(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new OverallError("سرویس مورد نظر یافت نشد", 404);
            }
            res
                .status(200)
                .json(await productSetService.getAvailableColorsForSet(id));
        }
        catch (error) {
            next(error);
        }
    }
    async getAvailability(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new OverallError("سرویس مورد نظر یافت نشد", 404);
            }
            const colorIdRaw = Number(req.query.colorId);
            const colorId = isNaN(colorIdRaw) ? undefined : colorIdRaw;
            const availableQuantity = await productSetService.getAvailableSetQuantity(id, colorId);
            let price = null;
            let isManual = false;
            let calculatedPrice = null;
            try {
                const priceInfo = await productSetService.getFinalSetPrice(id, colorId);
                price = priceInfo.price;
                isManual = priceInfo.isManual;
                calculatedPrice = priceInfo.calculatedPrice;
            }
            catch (priceError) {
                price = null;
            }
            res
                .status(200)
                .json({ availableQuantity, price, isManual, calculatedPrice });
        }
        catch (error) {
            next(error);
        }
    }
    async calcSetPricePreview(req, res, next) {
        try {
            const items = Array.isArray(req.body?.items) ? req.body.items : [];
            const colorIdRaw = Number(req.body?.colorId);
            const colorId = isNaN(colorIdRaw) ? undefined : colorIdRaw;
            res
                .status(200)
                .json(await productSetService.previewSetOptions(items, colorId));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new ProductSetController();
