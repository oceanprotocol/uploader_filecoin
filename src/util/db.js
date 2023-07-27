import { col, fn } from 'sequelize';
import db from '../models/data';

async function updateOrCreate(model, quoteId, newItem) {
  // First try to find the record
  const foundItem = await model.findOne({ where: { quoteId } });
  if (!foundItem) {
    // Item not found, create a new one
    const item = await model.create(newItem);
    return { item, created: true };
  }
  // Found an item, update it
  const item = await model.update(newItem, { where: { quoteId } });
  return { item, created: false };
}

export const putData = async (updatedDetails) =>
  await updateOrCreate(db.model, updatedDetails.quoteId, updatedDetails);

export const getLastKnowNonce = async (address) => {
  const [data] = await db.model.findAll({
    where: { userAddress: address },
    attributes: [[fn('max', col('nonce')), 'maxNonce']],
  });
  return +data?.dataValues?.maxNonce ?? 0;
};

export const updateData = async (updatedDetails) =>
  (
    await db.model.update(updatedDetails, {
      where: { quoteId: updatedDetails.quoteId },
    })
  )?.dataValues;
export const getData = async (quoteId) => {
  const Item = await db.model.findOne({ where: { quoteId } });
  if (!Item) {
    return null;
  }
  return Item?.dataValues;
};

export const getHistoryForAddress = async (address) => {
  const history = await db.model.findAll({
    where: {userAddress: address},
    attributes: [col('quoteId'), col('tokenAmount'), col('approveAddress'), col('tokenAddress'), col('chainId'), col('requestId')]
  });
  console.log(history)

  return history ?? null;
};
