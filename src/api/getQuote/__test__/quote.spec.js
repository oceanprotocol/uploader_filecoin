import { app } from '../../../app';
import { initializeDB } from '../../../models/data';
import { ethers } from 'ethers';
import request from 'supertest';
import config from '../../../config';

jest.setTimeout(30000);

describe('quota', () => {
  const wallet = new ethers.Wallet(
    '0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a'
  );

  beforeAll(async () => {
    await initializeDB();
  });

  describe('Test', () => {
    test('api should be locked down', async () => {
      let response = await request(app).get(`/upload`);
      expect(response.statusCode).toBe(406);
    });

    test("fails if input validation doesn't passes", async () => {
      let response = await request(app).post(`/upload`).send({
        address: wallet.address,
      });
      expect(typeof response.body).toBe('object');
      expect(response.statusCode).toBe(406);
      expect(JSON.stringify(response.body)).toMatch(/ValidationError/i);
    });

    test("fails if input validation doesn't passes", async () => {
      let response = await request(app).post(`/upload`).send({
        address: wallet.address,
      });
      expect(typeof response.body).toBe('object');
      expect(response.statusCode).toBe(406);
      expect(JSON.stringify(response.body)).toMatch(/ValidationError/i);
    });

    test('create Quota', async () => {
      let response = await request(app)
        .post(`/getQuote`)
        .send({
          type: 'filecoin',
          files: [
            {
              length: 42424242,
            },
            {
              length: 32424242,
            },
          ],
          payment: {
            chainId: Object.keys(config.contractInfo)[0],
            tokenAddress: config.contractInfo[Object.keys(config.contractInfo)[0]].currency.USDT,
          },
          duration: 4353545453,
          userAddress: wallet.address,
        });
      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(response.body)).toMatch(/quoteId/i);
      expect(response.statusCode).toBe(200);
    });
  });
});
