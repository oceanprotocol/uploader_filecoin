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
            chainId: 80001,
            tokenAddress: '0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2',
          },
          duration: 4353545453,
          userAddress: wallet.address,
        });
      let nonce = Date.now();
      
      let message = utils.sha256(utils.toUtf8Bytes(requestQuotaresponse.body.quoteId + nonce.toString()))
      // Sign the original message directly
      let signature = await wallet.signMessage(message)

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
      nonce = Date.now();
      const quoteId = '';
      message = utils.sha256(utils.toUtf8Bytes(quoteId + nonce.toString()))
    
      // Sign the original message directly
      signature = await wallet.signMessage(message)
      response = await request(app).get(
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
