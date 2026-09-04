export type ProductFilter = {
  categoryId?: number;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  enableOff?: string;
  pageNumber?: number;
  // when "plate": return flat plate cards only (real product ids, no pattern
  // grouping, no sets) — used by pickers like the set member selector
  type?: string;
};
