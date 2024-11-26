import request from "supertest";
import { User } from "../../src/entity/User";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncate } from "fs";
import { turncateTables } from "../utils";
import app from "../../src/app";
import { Roles } from "../../src/constants";
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
            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(400);
        });
    });

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            // Arrange
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: " rakesh@mern.space ",
                password: "password",
            };
            // Act
            await request(app as any)
                .post("/auth/register")
                .send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe("rakesh@mern.space");
        });
    });
});
