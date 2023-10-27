const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const { signJWT } = require("../middleware/auth");
const { KnexService } = require("../services/query");

const jwt = signJWT(1, "egebe@gmail.com");

const amountValue = {
  amount: 5000,
};

describe("User account with wallet funtionality ", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "test";
  });

  describe("POST /signup", () => {
    it("should respond user already registered", async () => {
      jest.spyOn(KnexService, "findUser").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([1]);
        });
      });
      const { statusCode, body } = await request(app).post("/signup").send({
        name: "ege",
        email: "egebe@gmail.com",
        password: "1394tuuiiA!",
      });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("error");
      expect(body).toStrictEqual({ error: "User already registered" });
    });

    it("should return created user", async () => {
      jest.spyOn(KnexService, "findUser").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve("");
        });
      });

      jest.spyOn(KnexService, "insert").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([5]);
        });
      });
      const response = await request(app).post("/signup").send({
        name: "ege",
        email: "egebe@gmail.com",
        password: "1394tuuiiA!",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("data");
      expect(response.body).toStrictEqual({
        message: "Your account is created, proceed to login",
        data: { name: "ege", value: "egebe@gmail.com" },
      });
    });
  });

  describe("POST /login", () => {
    it("should return username or password not found", async () => {
      jest.spyOn(KnexService, "findUser").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve("");
        });
      });

      const bcryptCompare = jest
        .fn()
        .mockRejectedValue(new Error("Random error"));
      bcrypt.compare = bcryptCompare;

      const { body, statusCode } = await request(app).post("/login").send({
        email: "egebe@gmail.com",
        password: "1394tuuiiA!",
      });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("error");
      expect(body).toStrictEqual({ error: "username or password not found" });
    });

    it("should return login successful", async () => {
      jest.spyOn(KnexService, "findUser").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([1]);
        });
      });

      const bcryptCompare = jest.fn().mockResolvedValue(true);
      bcrypt.compare = bcryptCompare;

      const { statusCode, body } = await request(app).post("/login").send({
        email: "egebe@gmail.com",
        password: "1394tuuiiA!",
      });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toStrictEqual({
        message: "Login Successful",
        data: {
          email: "egebe@gmail.com",
          token: `${body.data.token}`,
        },
      });
    });
  });

  describe("POST /fund", () => {
    it("should respond access denied with no token provided", async () => {
      jest.spyOn(KnexService, "incrementWallet").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([1]);
        });
      });
      const { statusCode, body } = await request(app)
        .post("/fund")
        .set("x-auth-token", `${""}`)
        .send({
          amount: 5000,
        });

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("message");
      expect(body).toStrictEqual({
        message: "Access denied. No token provided",
      });
    });

    it("should respond your account is successfully funded", async () => {
      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([33]);
        });
      });
      jest.spyOn(KnexService, "incrementWallet").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve(1);
        });
      });
      const { statusCode, body } = await request(app)
        .post("/fund")
        .set("x-auth-token", `${jwt}`)
        .send(amountValue);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toEqual({
        message: `Your account is successfully funded with ${amountValue.amount} naira`,
        data: body.data,
      });
    });
  });

  describe("POST /fundaccount", () => {
    it("should respond an invalid accont", async () => {
      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve("");
        });
      });
      const { statusCode, body } = await request(app)
        .post("/fundaccount")
        .set("x-auth-token", `${jwt}`)
        .send({
          accountNumber: 255784983,
          amount: 1,
        });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("error");
      expect(body).toStrictEqual({ error: "Invalid Account" });
    });

    it("should respond Insuffient Fund to complete this transfer", async () => {
      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([255784983]);
        });
      });

      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([0]);
        });
      });
      const { statusCode, body } = await request(app)
        .post("/fundaccount")
        .set("x-auth-token", `${jwt}`)
        .send({
          accountNumber: 255784983,
          amount: 1,
        });

      expect(statusCode).toBe(424);
      expect(body).toHaveProperty("error");
      expect(body).toStrictEqual({
        error: "Insuffient Fund to complete this transfer",
      });
    });

    it("should respond User account - 255784983 is funded with 1 naira", async () => {
      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([255784983]);
        });
      });

      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([500]);
        });
      });

      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([50]);
        });
      });

      jest.spyOn(KnexService, "decrementWallet").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([1]);
        });
      });

      jest.spyOn(KnexService, "incrementWallet").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([2]);
        });
      });
      const { statusCode, body } = await request(app)
        .post("/fundaccount")
        .set("x-auth-token", `${jwt}`)
        .send({
          accountNumber: 255784983,
          amount: 1,
        });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body).toStrictEqual({
        message: "User account - 255784983 is funded with 1 naira",
        data: { currentAccount: 49 },
      });
    });
  });

  describe("POST /withdrawal", () => {
    it("should respond access denied with no token provided", async () => {
      jest.spyOn(KnexService, "incrementWallet").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([1]);
        });
      });
      const { statusCode, body } = await request(app)
        .post("/withdrawal")
        .set("x-auth-token", `${""}`)
        .send({
          amount: 100,
        });

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("message");
      expect(body).toStrictEqual({
        message: "Access denied. No token provided",
      });
    });
    it("should respond Insuffient Fund to complete this transfer", async () => {
      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([10]);
        });
      });
      const { statusCode, body } = await request(app)
        .post("/withdrawal")
        .set("x-auth-token", `${jwt}`)
        .send({
          amount: 5000,
        });

      expect(statusCode).toBe(424);
      expect(body).toHaveProperty("error");
      expect(body).toStrictEqual({
        error: "Insuffient Fund to complete this transfer",
      });
    });

    it("Withdrawal of amount naira successful", async () => {
      jest.spyOn(KnexService, "isExist").mockImplementation(() => {
        return new Promise((resolve) => {
          resolve([10]);
        });
      });
      const { statusCode, body } = await request(app)
        .post("/withdrawal")
        .set("x-auth-token", `${jwt}`)
        .send({
          amount: 5,
        });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");

      expect(body).toStrictEqual({
        message: "Withdrawal of  5 naira successful",
        data: { currentAcccount: 5 },
      });
    });
  });
});
