import { app } from '../../../app';
import { initializeDB } from '../../../models/data';
import { ethers, utils } from 'ethers';
import request from 'supertest';
import { getLastKnowNonce } from '../../../util/db';
import config from '../../../config';
import { object } from 'joi';

jest.setTimeout(30000);

describe('getLink', () => {
  const wallet = new ethers.Wallet(
    '0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a'
  );

  beforeAll(async () => {
    await initializeDB();
  });

  describe('Test', () => {
    test('api should be locked down', async () => {
      let response = await request(app).get(`/getLink`);
      expect(response.statusCode).toBe(406);
    });

    test('Invalid QuoteId', async () => {
      let response = await request(app)
        .post(`/getLink?quoteId=7e24e&nonce=80&signature=0xXXXXX`)
        .send({
          address: wallet.address,
        });
      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(response.body)).toMatch(/invalid quoteID/i);
      expect(response.statusCode).toBe(400);
    });

    test('invalid Signature', async () => {
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
            chainId: Object.keys(config.contractInfo)[0],
            tokenAddress: config.contractInfo[Object.keys(config.contractInfo)[0]].currency.USDT,
          },
          duration: 4353545453,
          userAddress: wallet.address,
        });
      const nonce = 0

      const message = utils.sha256(utils.toUtf8Bytes(requestQuotaResponse.body.quoteId + nonce.toString()))
      // Sign the original message directly
      const signature = await wallet.signMessage(message)

      let response = await request(app).post(
        `/getLink?quoteId=${requestQuotaResponse.body.quoteId
        }&nonce=${nonce}&signature=${signature}`
      );
      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(response.body)).toMatch(/Invalid/i);
      expect(response.statusCode).toBe(400);
    });

    test('getLink for files', async () => {
      const size = 100000
      let requestQuotaResponse = await request(app)
        .post(`/getQuote`)
        .send({
          type: 'filecoin',
          files: [
            {
              length: size,
            },
          ],
          payment: {
            chainId: Object.keys(config.contractInfo)[0],
            tokenAddress: config.contractInfo[Object.keys(config.contractInfo)[0]].currency.USDT,
          },
          duration: 4353545453,
          userAddress: wallet.address,
        });
      const nonce = 101 + await getLastKnowNonce(wallet.address.toLowerCase())

      const message = utils.sha256(utils.toUtf8Bytes(requestQuotaResponse.body.quoteId + nonce.toString()))
      // Sign the original message directly
      const signature = await wallet.signMessage(message)

      let response = await request(app).post(
        `/getLink?quoteId=${requestQuotaResponse.body.quoteId
        }&nonce=${nonce}&signature=${signature}`
      );
      expect(typeof response.body).toBe('object');
      expect(response.body.length).toBe(0);
      expect(response.statusCode).toBe(200);
    });
  });
});
