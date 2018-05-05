import { parseJSON } from "../functions";

describe("functions", () => {
  describe("parseJSON", () => {
    it("returns error if parse json fails", () => {
      return parseJSON([]).catch(res => {
        expect(res).toEqual({ errors: ["Could not parse json data"] });
      });
    });
  });
});
