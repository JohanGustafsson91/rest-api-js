import "../message";
import * as router from "../../utils/router";
import { getFromDb, insertToDb } from "../../utils/database";
import * as fns from "../../utils/functions";
import * as userCtrl from "../user";

jest.mock("../../utils/database");

const files = {
  messages: [
    {
      message: "test",
      sender: "johan",
      receiver: "kalle"
    },
    {
      message: "test",
      sender: "kalle",
      receiver: "johan"
    }
  ],
  users: [{ username: "johan" }, { username: "kalle" }]
};

const mockedRes = {
  writeHead: jest.fn(),
  end: jest.fn()
};

describe("Controllers message", () => {
  beforeEach(() => {
    fns.getBodyDataFromRequest = jest.fn(req =>
      Promise.resolve(fns.parseJSON(req.body))
    );

    userCtrl.getUser = jest.fn(
      (key, cond, errorMessage, obj) =>
        cond({
          users: files["users"].filter(user => user.username === obj[key])
        })
          ? Promise.resolve(obj)
          : Promise.reject(errorMessage(obj, key))
    );

    insertToDb.mockImplementationOnce((arg, arg2, arg3) => Promise.resolve());

    router.sendResponse = jest.fn();
  });

  describe("PUT /api/message", () => {
    it("response with success", () => {
      const mockedReq = {
        method: "PUT",
        url: "/api/message",
        body: JSON.stringify({
          message: "New message",
          sender: "johan",
          receiver: "kalle"
        })
      };

      const expectedResponse = {
        message: "Message sent"
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(insertToDb.mock.calls[0][0]).toEqual("messages");
        expect(insertToDb.mock.calls[0][2]).toEqual({
          message: "New message",
          sender: "johan",
          receiver: "kalle"
        });
        expect(router.sendResponse.mock.calls[0][0]).toEqual(200);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("response with error if bad input message", () => {
      const mockedReq = {
        method: "PUT",
        url: "/api/message",
        body: JSON.stringify({
          message: "",
          sender: "johan",
          receiver: "kalle"
        })
      };

      const expectedResponse = {
        errors: ["Must provide a valid message (At least one letter)"]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("response with error if bad input sender", () => {
      const mockedReqBadSender = {
        method: "PUT",
        url: "/api/message",
        body: JSON.stringify({
          message: "Message",
          sender: "jo",
          receiver: "kalle"
        })
      };

      const expectedResponseBadSender = {
        errors: ["Must provide a valid sender"]
      };

      return router.handleRequest(mockedReqBadSender, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(
          expectedResponseBadSender
        );
      });
    });

    it("response with error if bad input receiver", () => {
      const mockedReqBadRecever = {
        method: "PUT",
        url: "/api/message",
        body: JSON.stringify({
          message: "Message",
          sender: "johan",
          receiver: "kalle bad"
        })
      };

      const expectedResponseBadRecever = {
        errors: ["Must provide a valid receiver"]
      };

      return router.handleRequest(mockedReqBadRecever, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(
          expectedResponseBadRecever
        );
      });
    });

    it("response with error if no sender", () => {
      fns.getBodyDataFromRequest = jest.fn(req =>
        Promise.resolve(fns.parseJSON(req.body))
      );

      userCtrl.getUser = jest.fn(
        (key, cond, errorMessage, obj) =>
          cond({
            users: [
              {
                username: "kalle"
              }
            ].filter(user => user.username === obj[key])
          })
            ? Promise.resolve(obj)
            : Promise.reject(errorMessage(obj, key))
      );

      const mockedReq = {
        method: "PUT",
        url: "/api/message",
        body: JSON.stringify({
          message: "New message",
          sender: "johan",
          receiver: "kalle"
        })
      };

      const expectedResponse = {
        errors: ["Enter a valid sender"]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("response with error if no receiver", () => {
      userCtrl.getUser = jest.fn(
        (key, cond, errorMessage, obj) =>
          cond({
            users: [
              {
                username: "johan"
              }
            ].filter(user => user.username === obj[key])
          })
            ? Promise.resolve(obj)
            : Promise.reject(errorMessage(obj, key))
      );

      const mockedReq = {
        method: "PUT",
        url: "/api/message",
        body: JSON.stringify({
          message: "New message",
          sender: "johan",
          receiver: "kalle"
        })
      };

      const expectedResponse = {
        errors: ["Enter a valid receiver"]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });
  });

  describe("GET /api/message/user/sent", () => {
    it("response with success", () => {
      getFromDb.mockImplementationOnce((db, key, fn) =>
        Promise.resolve({ [key]: files[db].filter(fn) })
      );

      const mockedReq = {
        method: "GET",
        url: "/api/message/johan/sent"
      };

      const expectedResponse = {
        messages: [
          {
            message: "test",
            sender: "johan",
            receiver: "kalle"
          }
        ]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(getFromDb.mock.calls[0][0]).toEqual("messages");
        expect(getFromDb.mock.calls[0][1]).toEqual("messages");
        expect(router.sendResponse.mock.calls[0][0]).toEqual(200);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("response with error", () => {
      const error = { errors: ["Error"] };
      getFromDb.mockImplementationOnce((db, key, fn) => Promise.reject(error));

      const mockedReq = {
        method: "GET",
        url: "/api/message/johan/sent"
      };

      return router.handleRequest(mockedReq, mockedRes).then(err => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(error);
      });
    });
  });

  describe("GET /api/message/user/received", () => {
    it("response with success", () => {
      getFromDb.mockImplementationOnce((db, key, fn) =>
        Promise.resolve({ [key]: files[db].filter(fn) })
      );

      const mockedReq = {
        method: "GET",
        url: "/api/message/johan/received"
      };

      const expectedResponse = {
        messages: [
          {
            message: "test",
            sender: "kalle",
            receiver: "johan"
          }
        ]
      };

      return router.handleRequest(mockedReq, mockedRes).then(res => {
        expect(getFromDb.mock.calls[0][0]).toEqual("messages");
        expect(getFromDb.mock.calls[0][1]).toEqual("messages");
        expect(router.sendResponse.mock.calls[0][0]).toEqual(200);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(expectedResponse);
      });
    });

    it("response with error", () => {
      const error = { errors: ["Error"] };
      getFromDb.mockImplementationOnce((db, key, fn) => Promise.reject(error));

      const mockedReq = {
        method: "GET",
        url: "/api/message/johan/received"
      };

      return router.handleRequest(mockedReq, mockedRes).then(err => {
        expect(router.sendResponse.mock.calls[0][0]).toEqual(400);
        expect(router.sendResponse.mock.calls[0][2]).toEqual(error);
      });
    });
  });
});
