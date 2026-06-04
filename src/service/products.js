import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import Product from "../db/models/product.js";

export const fetchProductsService = async ({ page, perPage, filter = {} }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const productQuery = Product.find();

  if (filter.category) {
    productQuery.where("category").equals(filter.category);
  }

  if (filter.name) {
    const nameRegex = new RegExp(filter.name, "i");
    productQuery.where("name").regex(nameRegex);
  }

  const totalProducts = await Product.find()
    .merge(productQuery)
    .countDocuments();

  const productsList = await productQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(totalProducts, perPage, page);

  return {
    products: productsList,
    ...paginationData,
  };
};