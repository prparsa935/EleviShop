import { Mold } from "../models/Mold.js";
import { MoldSize } from "../models/MoldSize.js";
import { MoldPattern } from "../models/MoldPattern.js";
import { Pattern } from "../models/Pattern.js";
import { Image } from "../models/Image.js";
import { Product } from "../models/product.js";
import { Inventory } from "../models/Inventory.js";
import dataSource from "../utils/dbConfiguration.js";
import { OverallError } from "../errors/orderSaveError.js";
class MoldService {
    constructor() {
        this.moldRepo = dataSource.getRepository(Mold);
        this.moldSizeRepo = dataSource.getRepository(MoldSize);
        this.moldPatternRepo = dataSource.getRepository(MoldPattern);
        this.patternRepo = dataSource.getRepository(Pattern);
    }
    async findMolds() {
        return await this.moldRepo.find({
            relations: ["sizes", "moldPatterns", "moldPatterns.pattern"],
            order: { id: "ASC" },
        });
    }
    async findMoldById(id) {
        const mold = await this.moldRepo.findOne({
            where: { id: id },
            relations: ["sizes", "moldPatterns", "moldPatterns.pattern"],
        });
        if (!mold) {
            throw new OverallError("قالب مورد نظر یافت نشد", 404);
        }
        return mold;
    }
    async saveMold(name, shape) {
        const existing = await this.moldRepo.findOne({ where: { name: name } });
        if (existing) {
            return existing;
        }
        const mold = new Mold();
        mold.name = name;
        mold.shape = shape ?? null;
        return await this.moldRepo.save(mold);
    }
    async updateMold(id, name, shape) {
        const mold = await this.findMoldById(id);
        if (name) {
            mold.name = name;
        }
        if (shape !== undefined) {
            mold.shape = shape;
        }
        return await this.moldRepo.save(mold);
    }
    async deleteMold(id) {
        const mold = await this.findMoldById(id);
        const sizeIds = (mold.sizes ?? []).map((size) => size.id);
        const moldPatternIds = (mold.moldPatterns ?? []).map((mp) => mp.id);
        const productRepo = dataSource.getRepository(Product);
        const inventoryRepo = dataSource.getRepository(Inventory);
        let usedCount = 0;
        if (sizeIds.length > 0) {
            usedCount += await inventoryRepo
                .createQueryBuilder("inventory")
                .where("inventory.sizeId IN (:...sizeIds)", { sizeIds })
                .getCount();
        }
        if (moldPatternIds.length > 0) {
            usedCount += await productRepo
                .createQueryBuilder("product")
                .where("product.moldPatternId IN (:...moldPatternIds)", {
                moldPatternIds,
            })
                .getCount();
        }
        if (usedCount > 0) {
            throw new OverallError("امکان حذف وجود ندارد: این قالب در محصولات استفاده شده است", 400);
        }
        await this.moldRepo.remove(mold);
    }
    async saveMoldSize(moldId, sizeLabel, height, width, weight) {
        const mold = await this.findMoldById(moldId);
        const existing = await this.moldSizeRepo.findOne({
            where: { mold: { id: moldId }, sizeLabel: sizeLabel },
        });
        if (existing) {
            return existing;
        }
        const moldSize = new MoldSize();
        moldSize.mold = mold;
        moldSize.sizeLabel = sizeLabel;
        moldSize.height = height;
        moldSize.width = width;
        moldSize.weight = weight;
        return await this.moldSizeRepo.save(moldSize);
    }
    async findPatterns() {
        return await this.patternRepo.find({
            relations: ["previewImage"],
            order: { id: "ASC" },
        });
    }
    async savePattern(name, previewImageId) {
        const existing = await this.patternRepo.findOne({ where: { name: name } });
        if (existing) {
            if (previewImageId && !existing.previewImage) {
                const image = await dataSource
                    .getRepository(Image)
                    .findOne({ where: { id: previewImageId } });
                if (image) {
                    existing.previewImage = image;
                    return await this.patternRepo.save(existing);
                }
            }
            return existing;
        }
        const pattern = new Pattern();
        pattern.name = name;
        if (previewImageId) {
            const image = await dataSource
                .getRepository(Image)
                .findOne({ where: { id: previewImageId } });
            if (image) {
                pattern.previewImage = image;
            }
        }
        return await this.patternRepo.save(pattern);
    }
    async saveMoldPattern(moldId, patternId) {
        const mold = await this.findMoldById(moldId);
        let pattern = null;
        if (patternId != null) {
            pattern = await this.patternRepo.findOne({ where: { id: patternId } });
            if (!pattern) {
                throw new OverallError("طرح مورد نظر یافت نشد", 404);
            }
        }
        const existingList = await this.moldPatternRepo.find({
            where: { mold: { id: moldId } },
            relations: ["pattern"],
        });
        const existing = existingList.find((moldPattern) => (moldPattern.pattern?.id ?? null) === (patternId ?? null));
        if (existing) {
            return existing;
        }
        const moldPattern = new MoldPattern();
        moldPattern.mold = mold;
        moldPattern.pattern = pattern;
        return await this.moldPatternRepo.save(moldPattern);
    }
}
export default new MoldService();
