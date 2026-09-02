import moldService from "../services/moldService.js";
import { OverallError } from "../errors/orderSaveError.js";
class MoldController {
    async findMolds(req, res) {
        return res.json(await moldService.findMolds());
    }
    async findMold(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new OverallError("قالب مورد نظر یافت نشد", 404);
            }
            return res.json(await moldService.findMoldById(id));
        }
        catch (error) {
            next(error);
        }
    }
    async findPatterns(req, res) {
        return res.json(await moldService.findPatterns());
    }
    async createMold(req, res, next) {
        try {
            const name = (req.body?.name ?? "").toString().trim();
            const shape = req.body?.shape
                ? req.body.shape.toString().trim()
                : null;
            if (!name) {
                throw new OverallError("نام قالب الزامی است", 400);
            }
            return res.json(await moldService.saveMold(name, shape));
        }
        catch (error) {
            next(error);
        }
    }
    async updateMold(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new OverallError("قالب مورد نظر یافت نشد", 404);
            }
            const name = req.body?.name
                ? req.body.name.toString().trim()
                : undefined;
            const shape = req.body?.shape !== undefined
                ? req.body.shape
                    ? req.body.shape.toString().trim()
                    : null
                : undefined;
            return res.json(await moldService.updateMold(id, name, shape));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteMold(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new OverallError("قالب مورد نظر یافت نشد", 404);
            }
            await moldService.deleteMold(id);
            return res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
    async createMoldSize(req, res, next) {
        try {
            const moldId = Number(req.body?.moldId);
            const sizeLabel = (req.body?.sizeLabel ?? "").toString().trim();
            if (isNaN(moldId) || !sizeLabel) {
                throw new OverallError("اطلاعات سایز ناقص است", 400);
            }
            const toNumOrNull = (value) => value != null && value !== "" ? Number(value) : null;
            const height = toNumOrNull(req.body?.height);
            const width = toNumOrNull(req.body?.width);
            const weight = toNumOrNull(req.body?.weight);
            return res.json(await moldService.saveMoldSize(moldId, sizeLabel, height, width, weight));
        }
        catch (error) {
            next(error);
        }
    }
    async createPattern(req, res, next) {
        try {
            const name = (req.body?.name ?? "").toString().trim();
            if (!name) {
                throw new OverallError("نام طرح الزامی است", 400);
            }
            const previewImageId = req.body?.previewImageId
                ? Number(req.body.previewImageId)
                : undefined;
            return res.json(await moldService.savePattern(name, previewImageId));
        }
        catch (error) {
            next(error);
        }
    }
    async createMoldPattern(req, res, next) {
        try {
            const moldId = Number(req.body?.moldId);
            if (isNaN(moldId)) {
                throw new OverallError("قالب مورد نظر یافت نشد", 404);
            }
            const patternId = req.body?.patternId != null && req.body.patternId !== ""
                ? Number(req.body.patternId)
                : null;
            return res.json(await moldService.saveMoldPattern(moldId, patternId));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new MoldController();
