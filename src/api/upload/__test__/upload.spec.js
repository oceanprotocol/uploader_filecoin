import { app } from "../../../app";
import { initializeDB } from "../../../models/data";

jest.setTimeout(30000);

describe("upload", () => {
  beforeAll(async () => {
    await initializeDB();
  });

  describe("Test", () => {});
});
