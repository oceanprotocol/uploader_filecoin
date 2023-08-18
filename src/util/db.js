import { col, fn, literal } from 'sequelize';
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
    where: { userAddress: address },
    attributes: [
      [literal("'filecoin'"), 'type'],
      [col('quoteId'), 'quoteId'],
      [col('userAddress'), 'userAddress'],
      [col('tokenAmount'), 'tokenAmount'],
      [col('approveAddress'), 'approveAddress'],
      [col('tokenAddress'), 'tokenAddress'],
      [col('chainId'), 'chainId'],
      [col('requestID'), 'requestID'],
      [col('isUsed'), 'isUsed'],
      [col('createdAt'), 'createdAt'],
      [col('updatedAt'), 'updatedAt'],
    ],
  });

  const values = [];
  for (let i = 0; i < 25; ++i) {
    const row = history[i];
    const {
      type,
      quoteId,
      userAddress,
      tokenAmount,
      approveAddress,
      tokenAddress,
      chainId,
      requestID,
      isUsed,
      createdAt,
      updatedAt,
    } = row.dataValues;
    values.push({
      type,
      quoteId,
      userAddress,
      tokenAmount,
      approveAddress,
      tokenAddress,
      chainId,
      requestID,
      isUsed,
      createdAt,
      updatedAt,
    });
    console.log('Type:', type);
    console.log('Quote ID:', quoteId);
    console.log('User Address:', userAddress);
    console.log('Token Amount:', tokenAmount);
    console.log('Approve Address:', approveAddress);
    console.log('Token Address:', tokenAddress);
    console.log('Chain ID:', chainId);
    console.log('Request ID:', requestID);
  }
  if (values) {
    const filteredValues = values.filter(
      (value) => value.userAddress === address
    );
    console.log('filteredValues: ', filteredValues);
    return filteredValues;
  }
  return null;
};
