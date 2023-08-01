import { app } from '../../../app';
import { initializeDB } from '../../../models/data';
import { ethers } from 'ethers';
import request from 'supertest';

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
      let nonce = Date.now();

      let response = await request(app)
        .get(`/getHistory`)
        .send({
          userAddress: wallet.address,
          nonce,
          signature: await wallet.signMessage(
            `${''}${nonce}`
          )
        });
      console.log('response: ', response)
      expect(typeof response.body).toBe('object');
      expect(response.statusCode).toBe(200);
      console.log('response: ', response)

    });
  });
});
