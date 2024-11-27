import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import request from "supertest";
import { User } from "../../src/entity/User";

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
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/login")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(201);
        });
        it("should if user id  and password are same return the 200 status code ", async () => {
            //AAA
            //Arrange
            const userData = {
                email: "vermaaditya860@gmail.com",
                password: "secretpassword",
            };
            //Act

            const response = await request(app as any)
                .post("/auth/login")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(201);
        });
    });

    describe("fields are Missings", () => {
        it("Should return 400 status code if email field is missing ", async () => {
            //Arrange
            const userData = {
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

        it("Should return 400 status code if Password field is missing ", async () => {
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
});
