import { app } from '../../../app';
import { initializeDB } from '../../../models/data';
import request from 'supertest';
import { utils, ethers } from 'ethers';

jest.setTimeout(30000);

describe('quota', () => {
  const wallet = new ethers.Wallet(
    '0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a'
  );

  beforeAll(async () => {
    await initializeDB();
  });

  describe('Test', () => {

    test('get history', async () => {
      const nonce = Date.now();
      const quoteId = '';
      const message = utils.sha256(utils.toUtf8Bytes(quoteId + nonce.toString()))
      // Sign the original message directly
      const signature = await wallet.signMessage(message)
      let response = await request(app).get(
        `/getHistory?userAddress=${
          wallet.address
        }&nonce=${nonce}&signature=${signature}`
      );
      console.log('response: ', response)
      expect(typeof response.body).toBe('object');
      expect(response.statusCode).toBe(200);

    });
  });
});
