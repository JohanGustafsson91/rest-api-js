import { writeFile, readFile } from "fs";
import { insertToDb, getFromDb } from "../database";

jest.mock("fs");

describe("database", () => {
  beforeEach(() => {
    readFile.mockImplementation((filepath, encoding, cb) => {
      return Promise.resolve(
        cb(
          null,
          JSON.stringify({
            data: [{ username: "kalle" }]
          })
        )
      );
    });

    writeFile.mockImplementationOnce((filepath, data, cb) => {
      return Promise.resolve(cb(null, data));
    });
  });

  describe("insertToDb", () => {
    it("inserts data in db", () => {
      return insertToDb("users", false, { users: [] }).then(res => {
        expect(readFile.mock.calls[0][1]).toEqual("UTF-8");
        expect(writeFile.mock.calls[0][1]).toEqual(
          JSON.stringify(
            {
              data: [{ username: "kalle" }, { users: [] }]
            },
            null,
            2
          )
        );
      });
    });

    it("inserts data in db with timestamp", () => {
      const created = new Date();
      return insertToDb("users", created, { username: "johan" }).then(res => {
        expect(readFile.mock.calls[1][1]).toEqual("UTF-8");
        expect(writeFile.mock.calls[1][1]).toEqual(
          JSON.stringify(
            {
              data: [{ username: "kalle" }, { username: "johan", created }]
            },
            null,
            2
          )
        );
      });
    });
  });

  describe("getFromDb", () => {
    it("gets data from db", () => {
      const cond = ({ username }) => username === "kalle";
      return getFromDb("users", "items", cond).then(res => {
        expect(readFile.mock.calls[0][1]).toEqual("UTF-8");
        expect(res).toEqual({ items: [{ username: "kalle" }] });
      });
    });

    it("handles errors", () => {
      readFile.mockImplementation((filepath, encoding, cb) => {
        return Promise.resolve(cb(true, null));
      });

      const cond = ({ username }) => username === "kalle";
      return getFromDb("users", "items", cond).catch(err => {
        expect(err).toEqual({ errors: ["Could not connect to database"] });
      });
    });

    it("handles empty", () => {
      readFile.mockImplementation((filepath, encoding, cb) => {
        return Promise.resolve(cb(null, null));
      });

      const cond = ({ username }) => username === "kalle";
      return getFromDb("users", "items", cond).then(res => {
        expect(res).toEqual({ items: [] });
      });
    });
  });
});
