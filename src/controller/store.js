import { getNearestStoreService } from "../service/store.js";

export const getNearestStore = async (req, res) => {
  const nearestStores = await getNearestStoreService();

  res.status(200).json({
    message: "Nearest stores retrieved successfully",
    data: nearestStores,
  });
};