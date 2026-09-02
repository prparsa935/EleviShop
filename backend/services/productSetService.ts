import { ProductSet } from "../models/ProductSet.js";
import { ProductSetItem } from "../models/ProductSetItem.js";
import { Plate } from "../models/plate.js";
import { Color } from "../models/Color.js";
import { Inventory } from "../models/Inventory.js";
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
        "inventories",
        "mainImage",
      ],
    });
  }

  private async loadSetItems(productSetId: number): Promise<ProductSetItem[]> {
    return await this.setItemRepo.find({
      where: { productSet: { id: productSetId } },
      relations: ["plate", "plate.inventories", "plate.mainImage"],
    });
  }

  private getInventoriesForColor(
    inventories: Inventory[] | undefined,
    colorId: number
  ): Inventory[] {
    return (inventories ?? []).filter((inv) => inv.colorId === colorId);
  }

  private getCommonColorIds(setItems: ProductSetItem[]): number[] {
    if (!setItems || setItems.length === 0) {
      return [];
    }
    let common: Set<number> | null = null;
    for (const item of setItems) {
      const colorIds = new Set<number>(
        (item.plate?.inventories ?? [])
          .filter((inv) => inv.colorId != null && (inv.quantity ?? 0) > 0)
          .map((inv) => inv.colorId as number)
      );
      if (common == null) {
        common = colorIds;
      } else {
        common = new Set([...common].filter((id) => colorIds.has(id)));
      }
      if (common.size === 0) {
        return [];
      }
    }
    return [...(common ?? [])].sort((a, b) => a - b);
  }

  private getAvailableQuantityFromItems(
    setItems: ProductSetItem[],
    colorId?: number
  ): number {
    if (colorId == null) {
      return 0;
    }
    let minRatio: number | null = null;
    for (const item of setItems) {
      const matching = this.getInventoriesForColor(
        item.plate?.inventories,
        colorId
      );
      const stock = matching.reduce(
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
    if (colorId == null) {
      return 0;
    }
    let totalPrice = 0;
    for (const item of setItems) {
      const matching = this.getInventoriesForColor(
        item.plate?.inventories,
        colorId
      );
      const inStock = matching.filter((inv) => (inv.quantity ?? 0) > 0);
      const priceList = inStock.length > 0 ? inStock : matching;
      if (priceList.length === 0) {
        throw new OverallError(
          `قطعه «${item.plate?.name ?? item.plate?.id}» در رنگ انتخابی موجود نیست`,
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
    if (colorId == null) {
      throw new OverallError("رنگ انتخاب نشده است", 400);
    }
    const components: SetComponent[] = [];
    for (const item of setItems) {
      const matching = this.getInventoriesForColor(
        item.plate?.inventories,
        colorId
      );
      const inventory = matching
        .slice()
        .sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0))[0];
      if (!inventory) {
        throw new OverallError(
          `قطعه «${item.plate?.name ?? item.plate?.id}» در رنگ انتخابی موجود نیست`,
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
    const commonColorIds = this.getCommonColorIds(setItems);
    if (commonColorIds.length === 0) {
      return { colors: [], hasNoCommonColor: true };
    }
    const colors = await this.colorRepo.find({
      where: { id: In(commonColorIds) },
    });
    const colorMap = new Map(colors.map((color) => [color.id, color]));
    const productSet = await this.productSetRepo.findOne({
      where: { id: productSetId },
    });
    const manualOverride =
      productSet && productSet.manualPriceOverride != null
        ? Number(productSet.manualPriceOverride)
        : null;
    const isManual = manualOverride != null && manualOverride > 0;
    const options = commonColorIds.map((colorId) => {
      const calculatedPrice = this.calculatePriceFromItems(setItems, colorId);
      return {
        colorId,
        name: colorMap.get(colorId)?.name ?? "",
        hexCode: colorMap.get(colorId)?.hexCode ?? "",
        calculatedPrice,
        price:
          isManual && manualOverride != null
            ? manualOverride
            : calculatedPrice,
        isManual,
        availableQuantity: this.getAvailableQuantityFromItems(
          setItems,
          colorId
        ),
        components: this.buildComponentsFromItems(setItems, colorId),
      };
    });
    return { colors: options, hasNoCommonColor: false };
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
      relations: ["inventories"],
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
    let commonColorIds = this.getCommonColorIds(setItems);
    if (commonColorIds.length === 0) {
      return { colors: [], hasNoCommonColor: true };
    }
    if (colorId != null) {
      commonColorIds = commonColorIds.filter((id) => id === colorId);
      if (commonColorIds.length === 0) {
        return { colors: [], hasNoCommonColor: true };
      }
    }
    const colors = await this.colorRepo.find({
      where: { id: In(commonColorIds) },
    });
    const colorMap = new Map(colors.map((color) => [color.id, color]));
    return {
      colors: commonColorIds.map((cid) => ({
        colorId: cid,
        name: colorMap.get(cid)?.name ?? "",
        hexCode: colorMap.get(cid)?.hexCode ?? "",
        calculatedPrice: this.calculatePriceFromItems(setItems, cid),
        availableQuantity: this.getAvailableQuantityFromItems(setItems, cid),
      })),
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
