-- Migration: move size from product level (product."moldSizeId") to inventory
-- level (inventory."sizeId"). A single plate now keeps one inventory row per
-- size x color combination instead of one product per size.
--
-- IMPORTANT: run this script ONCE, BEFORE starting the refactored backend.
-- If synchronize:true runs first, product."moldSizeId" is dropped by TypeORM
-- and the size links would be lost forever.

BEGIN;

ALTER TABLE inventory ADD COLUMN IF NOT EXISTS "sizeId" INT NULL;

UPDATE inventory
SET "sizeId" = p."moldSizeId"
FROM product p
WHERE inventory."productId" = p.id
  AND p."moldSizeId" IS NOT NULL;

ALTER TABLE product DROP COLUMN IF EXISTS "moldSizeId";

COMMIT;
