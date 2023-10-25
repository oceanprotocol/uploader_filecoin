import { utils, Contract, Wallet, ethers } from 'ethers';
import axios from 'axios';
import config from '../../config';
import { ERC20, DepositABI } from '../../abi/mini';
import { getData, getLastKnowNonce, updateData } from '../../util/db';

export const getQuotaData = async (quoteId) => {
  console.log('Fetching quota data for quoteID:', quoteId);

  const data = await getData(quoteId);
  console.log('Quota data fetched:', data);

  if (!data) {
    console.log('invalid quoteID');
    throw new Error('invalid quoteID');
  }
  return data;
};

export const validateSignature = async (quoteId, nonce, address, signature) => {
  console.log(
    'Validating signature for quoteID, nonce, address:',
    quoteId,
    nonce,
    address
  );

  try {
    const message = utils.sha256(utils.toUtf8Bytes(quoteId + nonce.toString()));
    console.log('Message for signature validation:', message);

    const signerAddress = utils.verifyMessage(message, signature).toLowerCase();
    console.log('Resolved signer address:', signerAddress);

    if (address.toLowerCase() === signerAddress) {
      console.log('Signature is valid');
      return true;
    }
    console.log('Signature is invalid');
  } catch (e) {
    console.error('Error during signature validation:', e);
    return false;
  }
  return false;
};

export const validateNonce = async (address, nonce) => {
  console.log('Validating nonce for address:', address);

  const lastNonce = await getLastKnowNonce(address);
  console.log('Last known nonce for address:', lastNonce);

  return lastNonce < +nonce;
};

export const checkAllowance = async (
  tokenAddress,
  address,
  amount,
  chainId
) => {
  console.log(
    'Checking allowance for tokenAddress, address, amount, chainId:',
    tokenAddress,
    address,
    amount,
    chainId
  );

  const provider = new ethers.providers.JsonRpcProvider(
    config.contractInfo[chainId].rpc
  );
  const contract = new Contract(tokenAddress, ERC20, provider);

  const allowance = await contract.allowance(
    address,
    config.contractInfo[chainId].contract
  );
  console.log('Allowance for address:', allowance);

  const balanceOf = await contract.balanceOf(address);
  console.log('Balance for address:', balanceOf);

  return allowance >= +amount && balanceOf >= +amount;
};

export const buyStorage = async (user, tokenAddress, amount, chainId) => {
  console.log(
    'Buying storage for user, tokenAddress, amount, chainId:',
    user,
    tokenAddress,
    amount,
    chainId
  );

  const provider = new ethers.providers.JsonRpcProvider(
    config.contractInfo[chainId].rpc
  );

  try {
    const signer = new Wallet(config.privateKey, provider);
    const depositContract = new Contract(
      config.contractInfo[chainId].contract,
      DepositABI,
      signer
    );

    // Estimate the gas required
    let estimatedGas;
    try {
      estimatedGas = await depositContract.estimateGas.ManagerAddDeposit(
        user,
        tokenAddress,
        amount
      );
      console.log('Estimated Gas: ', estimatedGas);
    } catch (error) {
      console.log('Failed to estimate gas: ', error);
      // Fallback to a default gas limit if estimation fails
      estimatedGas = 500000; // Set a default
    }

    console.log('Estimated Gas: ', estimatedGas);

    // Add a buffer (10% in this case)
    const gasWithBuffer = Math.floor(
      (typeof estimatedGas === 'number'
        ? estimatedGas
        : estimatedGas.toNumber()) * 1.1
    );
    console.log('Gas with buffer:', gasWithBuffer);

    // Execute the transaction with the gas buffer
    await depositContract.ManagerAddDeposit(user, tokenAddress, amount, {
      gasLimit: gasWithBuffer,
    });

    console.log('Storage purchased successfully');
    return true;
  } catch (e) {
    console.log('Error while buying storage', e.message);
    throw e;
  }
};

export const migrateCIDS = async (user, files) => {
  console.log('Migrating CIDS for user and files:', user, files);
  console.log(`using token: Bearer ${config.bearer_token}`);
  const data = {
    data: JSON.stringify(
      files.map((fileObj) => fileObj.ipfs_uri.split('//')[1])
    ), // Adjusted this line
    publicKey: user,
    enterprise: 'ocean_protocol',
  };
  console.log('sending data: ', data);

  try {
    const response = await axios({
      url: 'https://api.lighthouse.storage/api/lighthouse/migration_request_ent',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `Bearer ${config.bearer_token}`,
      },
      data,
    });

    console.log('Migration response:', response.data);
    return response.data;
  } catch (e) {
    console.error('Error during CIDS migration:', e);
    throw e;
  }
};

export const updateRow = async (nonce, quoteId, data) => {
  console.log(
    'Updating row for nonce, quoteId and data:',
    nonce,
    quoteId,
    data
  );

  try {
    const result = await updateData({
      quoteId,
      ...data,
      nonce,
      isUsed: true,
    });

    console.log('Row updated with result:', result);
    return result;
  } catch (e) {
    console.error('Error during row update:', e);
    throw e;
  }
};
