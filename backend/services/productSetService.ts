import { ProductSet } from "../models/ProductSet.js";
import { ProductSetItem } from "../models/ProductSetItem.js";
import { Plate } from "../models/plate.js";
import { Color } from "../models/Color.js";
import dataSource from "../utils/dbConfiguration.js";
import { In } from "typeorm";
import { OverallError } from "../errors/orderSaveError.js";

interface SetComponent {
  inventoryId: number;
  plateId: number;
  plateName: string;
  plateMainImage: string | null;
  inventoryPrice: number;
  inventoryQuantity: number;
  perSetQuantity: number;
}

interface SetColorOption {
  colorId: number;
  name: string;
  hexCode: string;
  calculatedPrice: number;
  price: number;
  isManual: boolean;
  availableQuantity: number;
  components: SetComponent[];
}

interface SetColorPreview {
  colorId: number;
  name: string;
  hexCode: string;
  calculatedPrice: number;
  availableQuantity: number;
}

class ProductSetService {
  private productSetRepo = dataSource.getRepository(ProductSet);
  private setItemRepo = dataSource.getRepository(ProductSetItem);
  private colorRepo = dataSource.getRepository(Color);

  async findProductSetById(id: number): Promise<ProductSet> {
    return await this.productSetRepo.findOne({
      where: { id: id },
      relations: [
        "productSetItems",
        "productSetItems.plate",
        "productSetItems.plate.mainImage",
        "productSetItems.plate.inventories",
        "productSetItems.plate.color",
        "inventories",
        "mainImage",
      ],
    });
  }

  private async loadSetItems(productSetId: number): Promise<ProductSetItem[]> {
    return await this.setItemRepo.find({
      where: { productSet: { id: productSetId } },
      relations: [
        "plate",
        "plate.inventories",
        "plate.color",
        "plate.mainImage",
      ],
    });
  }

  private getCommonColorId(setItems: ProductSetItem[]): number | null {
    if (!setItems || setItems.length === 0) {
      return null;
    }
    let commonColorId: number | null = null;
    for (const item of setItems) {
      const plateColorId = item.plate?.color?.id ?? null;
      if (plateColorId == null) {
        return null;
      }
      if (commonColorId == null) {
        commonColorId = plateColorId;
      } else if (commonColorId !== plateColorId) {
        return null;
      }
    }
    return commonColorId;
  }

  private getAvailableQuantityFromItems(
    setItems: ProductSetItem[],
    colorId?: number
  ): number {
    let minRatio: number | null = null;
    for (const item of setItems) {
      const plateColorId = item.plate?.color?.id ?? null;
      if (colorId != null && plateColorId != null && plateColorId !== colorId) {
        return 0;
      }
      const stock = (item.plate?.inventories ?? []).reduce(
        (sum, inv) => sum + (inv.quantity ?? 0),
        0
      );
      const ratio = stock / (item.quantity || 1);
      if (minRatio == null || ratio < minRatio) {
        minRatio = ratio;
      }
    }
    return Math.floor(minRatio ?? 0);
  }

  private calculatePriceFromItems(
    setItems: ProductSetItem[],
    colorId?: number
  ): number {
    let totalPrice = 0;
    for (const item of setItems) {
      const plateColorId = item.plate?.color?.id ?? null;
      if (colorId != null && plateColorId != null && plateColorId !== colorId) {
        throw new OverallError(
          `قطعه «${item.plate?.name ?? item.plate?.id}» در رنگ انتخابی موجود نیست`,
          400
        );
      }
      const inventories = item.plate?.inventories ?? [];
      const inStock = inventories.filter((inv) => (inv.quantity ?? 0) > 0);
      const priceList = inStock.length > 0 ? inStock : inventories;
      if (priceList.length === 0) {
        throw new OverallError(
          `قطعه «${item.plate?.name ?? item.plate?.id}» موجودی ثبت‌شده ندارد`,
          400
        );
      }
      const piecePrice = Math.min(...priceList.map((inv) => inv.price));
      totalPrice += piecePrice * (item.quantity || 1);
    }
    return totalPrice;
  }

  private buildComponentsFromItems(
    setItems: ProductSetItem[],
    colorId?: number
  ): SetComponent[] {
    const components: SetComponent[] = [];
    for (const item of setItems) {
      const plateColorId = item.plate?.color?.id ?? null;
      if (colorId != null && plateColorId != null && plateColorId !== colorId) {
        throw new OverallError(
          `قطعه «${item.plate?.name ?? item.plate?.id}» در رنگ انتخابی موجود نیست`,
          400
        );
      }
      const inventories = (item.plate?.inventories ?? [])
        .slice()
        .sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0));
      const inventory = inventories[0];
      if (!inventory) {
        throw new OverallError(
          `قطعه «${item.plate?.name ?? item.plate?.id}» موجودی ثبت‌شده ندارد`,
          400
        );
      }
      components.push({
        inventoryId: inventory.id,
        plateId: item.plate.id,
        plateName: item.plate.name,
        plateMainImage: item.plate.mainImage?.filePath ?? null,
        inventoryPrice: inventory.price,
        inventoryQuantity: inventory.quantity,
        perSetQuantity: item.quantity || 1,
      });
    }
    return components;
  }

  async getAvailableColorsForSet(productSetId: number): Promise<{
    colors: SetColorOption[];
    hasNoCommonColor: boolean;
  }> {
    const setItems = await this.loadSetItems(productSetId);
    if (!setItems || setItems.length === 0) {
      return { colors: [], hasNoCommonColor: false };
    }
    const commonColorId = this.getCommonColorId(setItems);
    if (commonColorId == null) {
      return { colors: [], hasNoCommonColor: true };
    }
    const color = await this.colorRepo.findOne({
      where: { id: commonColorId },
    });
    const calculatedPrice = this.calculatePriceFromItems(
      setItems,
      commonColorId
    );
    const productSet = await this.productSetRepo.findOne({
      where: { id: productSetId },
    });
    const manualOverride =
      productSet && productSet.manualPriceOverride != null
        ? Number(productSet.manualPriceOverride)
        : null;
    const isManual = manualOverride != null && manualOverride > 0;
    const option: SetColorOption = {
      colorId: commonColorId,
      name: color?.name ?? "",
      hexCode: color?.hexCode ?? "",
      calculatedPrice,
      price:
        isManual && manualOverride != null ? manualOverride : calculatedPrice,
      isManual,
      availableQuantity: this.getAvailableQuantityFromItems(
        setItems,
        commonColorId
      ),
      components: this.buildComponentsFromItems(setItems, commonColorId),
    };
    return { colors: [option], hasNoCommonColor: false };
  }

  async getAvailableSetQuantity(
    productSetId: number,
    colorId?: number
  ): Promise<number> {
    const setItems = await this.loadSetItems(productSetId);
    if (!setItems || setItems.length === 0) {
      return 0;
    }
    return this.getAvailableQuantityFromItems(setItems, colorId);
  }

  async calculateSetPrice(
    productSetId: number,
    colorId?: number
  ): Promise<number> {
    const setItems = await this.loadSetItems(productSetId);
    if (!setItems || setItems.length === 0) {
      return 0;
    }
    return this.calculatePriceFromItems(setItems, colorId);
  }

  async getFinalSetPrice(
    productSetId: number,
    colorId?: number
  ): Promise<{ price: number; isManual: boolean; calculatedPrice: number }> {
    const productSet = await this.productSetRepo.findOne({
      where: { id: productSetId },
    });
    if (!productSet) {
      throw new OverallError("سرویس مورد نظر یافت نشد", 404);
    }
    const calculatedPrice = await this.calculateSetPrice(productSetId, colorId);
    const manualOverride =
      productSet.manualPriceOverride != null
        ? Number(productSet.manualPriceOverride)
        : null;
    const isManual = manualOverride != null && manualOverride > 0;
    return {
      price:
        isManual && manualOverride != null ? manualOverride : calculatedPrice,
      isManual,
      calculatedPrice,
    };
  }

  async previewSetOptions(
    items: { plateId: number; quantity: number }[],
    colorId?: number
  ): Promise<{ colors: SetColorPreview[]; hasNoCommonColor: boolean }> {
    if (!items || items.length === 0) {
      return { colors: [], hasNoCommonColor: false };
    }
    const plates = await dataSource.getRepository(Plate).find({
      where: { id: In(items.map((item) => item.plateId)) },
      relations: ["inventories", "color"],
    });
    const plateMap = new Map(plates.map((plate) => [plate.id, plate]));
    const setItems = items.map((item) => {
      const plate = plateMap.get(item.plateId);
      if (!plate) {
        throw new OverallError(`بشقاب با شناسه ${item.plateId} یافت نشد`, 404);
      }
      const setItem = new ProductSetItem();
      setItem.plate = plate;
      setItem.quantity = item.quantity || 1;
      return setItem;
    });
    const commonColorId = this.getCommonColorId(setItems);
    if (commonColorId == null) {
      return { colors: [], hasNoCommonColor: true };
    }
    const color = await this.colorRepo.findOne({
      where: { id: commonColorId },
    });
    return {
      colors: [
        {
          colorId: commonColorId,
          name: color?.name ?? "",
          hexCode: color?.hexCode ?? "",
          calculatedPrice: this.calculatePriceFromItems(
            setItems,
            commonColorId
          ),
          availableQuantity: this.getAvailableQuantityFromItems(
            setItems,
            commonColorId
          ),
        },
      ],
      hasNoCommonColor: false,
    };
  }

  async computeCalculatedPriceFromPlateItems(
    items: { plateId: number; quantity: number }[]
  ): Promise<number> {
    if (!items || items.length === 0) {
      return 0;
    }
    const plates = await dataSource.getRepository(Plate).find({
      where: { id: In(items.map((item) => item.plateId)) },
      relations: ["inventories"],
    });
    const plateMap = new Map(plates.map((plate) => [plate.id, plate]));
    let total = 0;
    for (const item of items) {
      const plate = plateMap.get(item.plateId);
      if (!plate) {
        continue;
      }
      const inventories = plate.inventories ?? [];
      const inStock = inventories.filter((inv) => (inv.quantity ?? 0) > 0);
      const priceList = inStock.length > 0 ? inStock : inventories;
      if (priceList.length === 0) {
        continue;
      }
      total +=
        Math.min(...priceList.map((inv) => inv.price)) * (item.quantity || 1);
    }
    return total;
  }

  async resolveSetInventoriesForColor(
    productSetId: number,
    colorId?: number
  ): Promise<SetComponent[]> {
    const setItems = await this.loadSetItems(productSetId);
    if (!setItems || setItems.length === 0) {
      throw new OverallError("سرویس مورد نظر یافت نشد یا آیتمی ندارد", 404);
    }
    return this.buildComponentsFromItems(setItems, colorId);
  }
}
export default new ProductSetService();
