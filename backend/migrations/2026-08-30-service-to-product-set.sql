-- Migration: rename discriminator 'service' -> 'productSet' and move the old
-- Plate.service relation (product."serviceId" column) into the new
-- product_set_item join table. Legacy links get quantity = 1 (quantity was not
-- tracked before this refactor).
--
-- IMPORTANT: run this script ONCE, BEFORE starting the refactored backend.
-- If synchronize:true runs first, the serviceId column is dropped and the
-- plate->set links would be lost forever.

BEGIN;

CREATE TABLE IF NOT EXISTS product_set_item (
  id SERIAL PRIMARY KEY,
  quantity integer NOT NULL DEFAULT 1,
  "productSetId" integer NOT NULL,
  "plateId" integer NOT NULL,
  CONSTRAINT "UQ_product_set_item_set_plate" UNIQUE ("productSetId", "plateId")
);

INSERT INTO product_set_item ("productSetId", "plateId", quantity)
SELECT p."serviceId", p.id, 1
FROM product p
WHERE p."serviceId" IS NOT NULL
ON CONFLICT DO NOTHING;

UPDATE product SET type = 'productSet' WHERE type = 'service';

ALTER TABLE product DROP COLUMN IF EXISTS "serviceId";

COMMIT;
