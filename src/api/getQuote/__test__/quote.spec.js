import { app } from "../../../app";
import { initializeDB } from "../../../models/data";

jest.setTimeout(30000);

describe("getQuote", () => {
  beforeAll(async () => {
    await initializeDB();
  });

  describe("Test", () => {});
});
