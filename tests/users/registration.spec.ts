import request from "supertest";
import { User } from "../../src/entity/User";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncate } from "fs";
import app from "../../src/app";
import { Roles } from "../../src/constants";
import { cookie } from "express-validator";
import { isJwt } from "../utils";
describe("POST request /auth/register", () => {
    let connection: DataSource;

    //jest provide hook

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        //Database  truncate
        await connection.dropDatabase();
        await connection.synchronize();
        // await turncateTables(connection);
    });

    afterAll(async () => {
        if (connection && connection.isInitialized) {
            await connection.destroy();
        }
    });

    describe("Given all fields", () => {
        it("should return the 201 status code ", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "Aditya",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(201);
        });

        it("should return the 201 status code ", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "Aditya",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should persist the user in the database", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "Adi",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);
            //Assert
            const useRepository = connection.getRepository(User);
            const users = await useRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
        });

        it("should return the 201 status code ", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "Aditya",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should return user unique id ", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "Adi",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.body).toHaveProperty("id");
            const repository = connection.getRepository(User);
            const users = await repository.find();
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            );
        });
        it("should persist the user in the database", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "Adi",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);
            //Assert
            const useRepository = connection.getRepository(User);
            const users = await useRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
        });

        it("should asign role to be customer", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "Adi",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);
            //Assert
            const useRepository = connection.getRepository(User);
            const users = await useRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
        it("should store he hashed password in the database", async () => {
            //Arrange
            const userData = {
                firstName: "Adi",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            //Assert

            const useRepository = connection.getRepository(User);
            const users = await useRepository.find();
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it("should return 400 if email already exists", async () => {
            //Arrange
            const userData = {
                firstName: "Adi",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            const useRepository = connection.getRepository(User);
            await useRepository.save({ ...userData, role: Roles.CUSTOMER });
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            //Assert

            const users = await useRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
        it("should return the access token and refresh token inside a cookie", async () => {
            // Arrange
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "password",
            };

            // Act
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            interface Headers {
                ["set-cookie"]: string[];
            }
            // Assert
            let accessToken = null;
            let refreshToken = null;
            // accessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjkzOTA5Mjc2LCJleHAiOjE2OTM5MDkzMzYsImlzcyI6Im1lcm5zcGFjZSJ9.KetQMEzY36vxhO6WKwSR-P_feRU1yI-nJtp6RhCEZQTPlQlmVsNTP7mO-qfCdBr0gszxHi9Jd1mqf-hGhfiK8BRA_Zy2CH9xpPTBud_luqLMvfPiz3gYR24jPjDxfZJscdhE_AIL6Uv2fxCKvLba17X0WbefJSy4rtx3ZyLkbnnbelIqu5J5_7lz4aIkHjt-rb_sBaoQ0l8wE5KzyDNy7mGUf7cI_yR8D8VlO7x9llbhvCHF8ts6YSBRBt_e2Mjg5txtfBaDq5auCTXQ2lmnJtMb75t1nAFu8KwQPrDYmwtGZDkHUcpQhlP7R-y3H99YnrWpXbP8Zr_oO67hWnoCSw; Max-Age=43200; Domain=localhost; Path=/; Expires=Tue, 05 Sep 2023 22:21:16 GMT; HttpOnly; SameSite=Strict

            const rawCookies = response.headers["set-cookie"];
            const cookies: string[] = Array.isArray(rawCookies)
                ? rawCookies
                : [rawCookies];

            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }

                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });
    describe("fields are Missing ", () => {
        it("Should return 400 status code if email field is missing ", async () => {
            //Arrange
            const userData = {
                firstName: "Adi",
                lastName: "Verma",
                email: "",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            //Assert
            const useRepository = connection.getRepository(User);
            const users = await useRepository.find();
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it("Should return 400 status code if First Name field is missing ", async () => {
            //Arrange
            const userData = {
                firstName: "",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            //Assert
            const useRepository = connection.getRepository(User);
            const users = await useRepository.find();
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });

        it("Should return 400 status code if last Name field is missing ", async () => {
            //Arrange
            const userData = {
                firstName: "Aditya",
                lastName: "",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            //Assert
            const useRepository = connection.getRepository(User);
            const users = await useRepository.find();
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });
        it("Should return 400 status code if last Name field is missing ", async () => {
            //Arrange
            const userData = {
                firstName: "Aditya",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            //Assert
            const useRepository = connection.getRepository(User);
            const users = await useRepository.find();
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });
    });

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            // Arrange
            const userData = {
                firstName: "Aditya",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            // Act
            await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe("vermaaditya860@gmail.com");
        });
        it("should return 400 status code if password length is less than 8 chars", async () => {
            // Arrange
            const userData = {
                firstName: "Aditya",
                lastName: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secret",
            };
            // Act
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it("shoud return an array of error messages if email is missing", async () => {
            // Arrange
            const userData = {
                firstName: "Aditya",
                lastName: "Verma",
                email: "",
                password: "secretpassword",
            };
            // Act
            const response = await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty("errors");
            expect(
                (response.body as Record<string, string>).errors.length,
            ).toBeGreaterThan(0);
        });
    });
});
