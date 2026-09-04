// Mimics ProductController.createproduct / updateProduct validation + the
// overallErrorHandler mapping, using the real compiled DTOs.
import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { PlateSaveDto, ProductSetSaveDto, UpdateProductDto } from "../dist/dtos/product.dto.js";

const mapFieldErrors = (validationErrors) => {
  // same code as backend/middlewares/errorHandler.ts overallErrorHandler
  const fieldErrors = {};
  validationErrors.forEach((error) => {
    fieldErrors[error.property] = Object.values(error.constraints)[0];
  });
  return fieldErrors;
};

const run = async (name, Dto, payload) => {
  const dto = plainToInstance(Dto, payload);
  const errors = await validate(dto);
  const flattenErrors = errors.flat();
  console.log("=====", name, "=====");
  console.log("top-level failing properties:", errors.map((e) => e.property));
  for (const e of errors) {
    console.log(
      ` - ${e.property}: constraints=${JSON.stringify(e.constraints)} children=${JSON.stringify(
        (e.children || []).map((c) => ({ property: c.property, constraints: c.constraints }))
      )}`
    );
  }
  try {
    console.log("mapped fieldErrors:", JSON.stringify(mapFieldErrors(flattenErrors), null, 2));
  } catch (err) {
    console.log("!!! mapping threw (=> HTTP 500 inside errorHandler):", err.message);
  }
  console.log();
};

// payload exactly as the frontend builds it for a NEW set (getFormValues + preparePayload)
const saveSetPayload = {
  code: "12345",
  productName: "سرویس پذیرایی",
  description: "یک سرویس پذیرایی زیبا برای میز شما",
  offPercent: 0,
  material: "چینی",
  inventories: [],
  contain: "شامل ۶ عدد",
  items: [{ plateId: 12, quantity: 2 }],
  type: "productSet",
  imageIds: [3, 4],
  categoryId: 7,
  mainImageId: 3,
};

// same but manual price left empty on EDIT (frontend sends null explicitly)
const updateSetPayload = {
  ...saveSetPayload,
  manualPriceOverride: null,
  moldPatternId: undefined,
};

// a valid plate payload for reference
const savePlatePayload = {
  code: "12345",
  productName: "بشقاب گلدار",
  description: "یک بشقاب گلدار خیلی زیبا برای میز",
  offPercent: 10,
  material: "چینی",
  inventories: [{ id: undefined, colorId: 1, sizeId: 2, price: 100000, quantity: 5 }],
  type: "plate",
  imageIds: [3],
  categoryId: 7,
  mainImageId: 3,
  moldPatternId: 9,
};

await run("SAVE plate (reference)", PlateSaveDto, savePlatePayload);
await run("SAVE productSet", ProductSetSaveDto, saveSetPayload);
await run("UPDATE productSet", UpdateProductDto, updateSetPayload);
