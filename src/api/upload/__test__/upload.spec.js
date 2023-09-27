import { app } from '../../../app';
import { initializeDB } from '../../../models/data';
import { ethers, utils } from 'ethers';
import request from 'supertest';
import config from '../../../config';

jest.setTimeout(30000);

describe('upload', () => {
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

    test('successful purchase', async () => {
      let requestQuotaresponse = await request(app)
        .post(`/getQuote`)
        .send({
          type: 'filecoin',
          files: [
            {
              length: 0,
            },
          ],
          payment: {
            chainId: Object.keys(config.contractInfo)[0],
            tokenAddress: config.contractInfo[Object.keys(config.contractInfo)[0]].currency.USDT,
          },
          duration: 4353545453,
          userAddress: wallet.address,
        });
      const nonce = Date.now();

      const message = utils.sha256(utils.toUtf8Bytes(requestQuotaresponse.body.quoteId + nonce.toString()))
      // Sign the original message directly
      const signature = await wallet.signMessage(message)

      let response = await request(app)
        .post(`/upload`)
        .send({
          quoteId: requestQuotaresponse.body.quoteId,
          nonce,
          signature,
          files: ['ipfs://QmaiauHSgTDMy2NtLbsygL3iKmLXBqHf39SBA1nAQFSSey'],
        });
      expect(typeof response.body).toBe('object');
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/success/i);
    });
  });
});
