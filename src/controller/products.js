import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { fetchProductsService } from "../service/products.js";

export const fetchProductsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const appliedFilters = parseFilterParams(req.query);

  const productsList = await fetchProductsService({
    page,
    perPage,
    filter: appliedFilters,
  });

  res.status(200).json({
    message: "Products fetched successfully",
    data: productsList,
  });
};