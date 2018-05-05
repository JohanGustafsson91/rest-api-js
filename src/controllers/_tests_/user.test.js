import * as ctrl from "../user";
import { hash } from "bcrypt-nodejs";
import * as router from "../../utils/router";
import { getFromDb, insertToDb } from "../../utils/database";
import * as fns from "../../utils/functions";

jest.mock("../../utils/database");
jest.mock("bcrypt-nodejs");

const files = {
  users: [{ username: "johan", email: "email", pass: "pass" }]
};

const mockedRes = {
  writeHead: jest.fn(),
  end: jest.fn()
};

hash.mockImplementationOnce((pass, salt, arg, fn) => fn(null, "hashedPass"));

describe("Controllers users", () => {
  beforeEach(() => {
    fns.getBodyDataFromRequest = jest.fn(req =>
      Promise.resolve(fns.parseJSON(req.body))
    );

    getFromDb.mockImplementationOnce((db, key, fn) =>
      Promise.resolve({ [key]: files[db].filter(fn) })
    );

    ctrl.getUser = jest.fn(
      (key, cond, errorMessage, obj) =>
        cond({
          users: files.users.filter(user => user.username === obj[key])
        })
          ? Promise.resolve(obj)
          : Promise.reject(errorMessage(obj, key))
    );

    insertToDb.mockImplementationOnce((arg, arg2, arg3) => Promise.resolve());

    router.sendResponse = jest.fn();
  });

  describe("PUT /api/user", () => {
    it("responses with success", () => {
      const mockedReq = {
        method: "PUT",
        url: "/api/user",
        body: JSON.stringify({
          username: "Kalle",
          email: "johan@gmail.com",
          password: "pass123Hej"
        })
      };

      const expectedResponse = {
        message: "User added!"
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(insertToDb.mock.calls[0][2]).toEqual({
          username: "Kalle",
          email: "johan@gmail.com",
          password: "hashedPass"
        });
        expect(router.sendResponse.mock.calls[0][0]).toEqual(200);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("responses with error when hash of password fails", () => {
      hash.mockImplementationOnce((pass, salt, arg, fn) => fn("ERROR", null));

      const mockedReq = {
        method: "PUT",
        url: "/api/user",
        body: JSON.stringify({
          username: "Kalle",
          email: "johan@gmail.com",
          password: "pass123Hej"
        })
      };

      const expectedResponse = {
        errors: ["Could not add user"]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("responses with error on bad username", () => {
      const mockedReq = {
        method: "PUT",
        url: "/api/user",
        body: JSON.stringify({
          username: "jo",
          email: "johan@gmail.com",
          password: "pass123Hej"
        })
      };

      const expectedResponse = {
        errors: [
          "Must provide a valid username (min 3 chars of letters, numbers, _, -)"
        ]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("responses with error on bad email", () => {
      const mockedReq = {
        method: "PUT",
        url: "/api/user",
        body: JSON.stringify({
          username: "joha",
          email: "johan@gmail",
          password: "pass123Hej"
        })
      };

      const expectedResponse = {
        errors: ["Must provide a valid email"]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("responses with error on bad password", () => {
      const mockedReq = {
        method: "PUT",
        url: "/api/user",
        body: JSON.stringify({
          username: "johan",
          email: "johan@gmail.com",
          password: "pass123hej"
        })
      };

      const expectedResponse = {
        errors: [
          "Must provide a valid password (8 chars with one upper, lower and digit)"
        ]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("responses with error if user already exists", () => {
      const mockedReq = {
        method: "PUT",
        url: "/api/user",
        body: JSON.stringify({
          username: "johan",
          email: "johan@gmail.com",
          password: "pass123Hej"
        })
      };

      const expectedResponse = {
        errors: ["username already exists."]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });
  });

  describe("GET /api/user?q=query", () => {
    it("responses with success", () => {
      const mockedReq = {
        method: "GET",
        url: "/api/user?q=johan"
      };

      const expectedResponse = {
        users: [{ username: "johan", email: "email" }]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(200);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });
  });
});
