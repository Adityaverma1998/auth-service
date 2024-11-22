import request from "supertest";
import app from "../../src/app";
describe("POST request /auth/register", () => {
    describe("Given all fields", () => {
        it("should return the 201 status code ", async () => {
            //AAA
            //Arrange
            const userData = {
                firstName: "Aditya",
                lastNAame: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secret",
            };
            //Act

            const response = await request(app)
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
                lastNAame: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secret",
            };
            //Act

            const response = await request(app)
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
                firstName: "Aditya",
                lastNAame: "Verma",
                email: "vermaaditya860@gmail.com",
                password: "secret",
            };
            //Act

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });
    });
    describe("fields are Missing ", () => {});
});
