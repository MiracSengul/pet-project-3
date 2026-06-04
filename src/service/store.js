import Store from "../db/models/store.js";


export const getNearestStoreService = async (req, res) => { 
    const stores = await Store.find();

    return stores;
}