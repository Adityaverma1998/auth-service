import request from "supertest";
import { User } from "../../src/entity/User";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncate } from "fs";
import { turncateTables } from "../utils";
import app from "../../src/app";
describe("POST request /auth/register", () => {
    let connection: DataSource;

    //jest provide hook

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        //Database  truncate
        await turncateTables(connection);
    });

    afterAll(async () => {
        if (connection && connection.isInitialized) {
            console.log("Destroying database connection...");
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
                password: "secret",
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
                password: "secret",
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
                password: "secret",
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
                password: "secret",
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
                password: "secret",
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
            expect(users[0].lastName).toBe(userData.lastName);

            expect(users[0].email).toBe(userData.email);
            expect(typeof users[0].id).toBe("number");
        });
    });
    describe("fields are Missing ", () => {});
});
