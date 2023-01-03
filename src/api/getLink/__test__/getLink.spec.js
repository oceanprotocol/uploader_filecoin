import { app } from "../../../app";
import { initializeDB } from "../../../models/data";
import { ethers } from "ethers";
import request from "supertest";

jest.setTimeout(30000);

describe("getLink", () => {
  const wallet = new ethers.Wallet(
    "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a"
  );

  beforeAll(async () => {
    await initializeDB();
  });

  describe("Test", () => {
    test("api should be locked down", async () => {
      let response = await request(app).get(`/getLink`);
      expect(response.statusCode).toBe(406);
    });

    test("Invalid QuoteId", async () => {
      let response = await request(app)
        .post(`/getLink?quoteId=7e24e&nonce=80&signature=0xXXXXX`)
        .send({
          address: wallet.address,
        });
      expect(typeof response.body).toBe("object");
      expect(JSON.stringify(response.body)).toMatch(/invalid quoteID/i);
      expect(response.statusCode).toBe(400);
    });

    test("invalid Signature", async () => {
      let requestQuotaResponse = await request(app)
        .post(`/getQuote`)
        .send({
          type: "filecoin",
          files: [
            {
              length: 0,
            },
          ],
          payment: {
            chainId: 80001,
            tokenAddress: "0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2",
          },
          duration: 4353545453,
          userAddress: wallet.address,
        });
      const nonce = 0;
      let response = await request(app).post(
        `/getLink?quoteId=${
          requestQuotaResponse.body.quoteId
        }&nonce=${nonce}&signature=${await wallet.signMessage(
          `${requestQuotaResponse.body.quoteId}${nonce - 1}`
        )}`
      );
      expect(typeof response.body).toBe("object");
      expect(JSON.stringify(response.body)).toMatch(/Invalid Signature/i);
      expect(response.statusCode).toBe(400);
    });

    test("getLink for files", async () => {
      let requestQuotaResponse = await request(app)
        .post(`/getQuote`)
        .send({
          type: "filecoin",
          files: [
            {
              length: 0,
            },
          ],
          payment: {
            chainId: 80001,
            tokenAddress: "0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E2",
          },
          duration: 4353545453,
          userAddress: wallet.address,
        });
      const nonce = Date.now();
      let response = await request(app).post(
        `/getLink?quoteId=${
          requestQuotaResponse.body.quoteId
        }&nonce=${nonce}&signature=${await wallet.signMessage(
          `${requestQuotaResponse.body.quoteId}${nonce}`
        )}`
      );
      expect(typeof response.body).toBe("object");
      expect(response.body.length).toBe(0);
      expect(response.statusCode).toBe(200);
    });
  });
});
