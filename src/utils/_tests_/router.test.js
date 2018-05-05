import { handleRequest, getBodyDataFromRequest } from "../router";

describe("router", () => {
  describe("handleRequest", () => {
    it("responds with 404 if no route found", () => {
      const req = {
        method: "UNKNOWN",
        url: "not/this/one"
      };

      const res = {
        writeHead: jest.fn(),
        end: jest.fn()
      };

      const result = handleRequest(req, res);

      expect(res.writeHead.mock.calls[0][0]).toEqual(404);
    });
  });
});
