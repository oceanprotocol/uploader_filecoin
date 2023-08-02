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
      let requestQuotaResponse = await request(app)
        .post(`/getQuote`)
        .send({
          type: 'filecoin',
          files: [
            {
              length: 0,
            },
          ],
          payment: {
            chainId: 80001,
            tokenAddress: '0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2',
          },
          duration: 4353545453,
          userAddress: wallet.address,
        });

      const nonce = Date.now();
      const quoteId = '';
      let response = await request(app).get(
        `/getHistory?userAddress=${
          requestQuotaResponse.body.userAddress
        }&nonce=${nonce}&signature=${await wallet.signMessage(
          `${quoteId}${nonce}`
        )}`
      );
      console.log('response: ', response)
      expect(typeof response.body).toBe('object');
      // expect(response.body.length).toBe(0);
      // expect(response.statusCode).toBe(200);

      // response = await request(app)
      //   .get(`/getHistory`)
      //   .send({
      //     userAddress: wallet.address,
      //     nonce,
      //     signature: await wallet.signMessage(
      //       `${''}${nonce}`
      //     )
      //   });
      
      // expect(typeof response.body).toBe('object');
      // expect(response.statusCode).toBe(200);
      // console.log('response: ', response)

    });
  });
});
