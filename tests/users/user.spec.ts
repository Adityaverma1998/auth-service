import app from "../../src/app";
import request from "supertest";
describe("GET /auth/self", () => {
    describe("Given all fields", () => {
        it("should return the 200 status code", async () => {
            // const accessToken = jwks.token({
            //     sub: "1",
            //     role: Roles.CUSTOMER,
            // });
            const response = await request(app as any).get("/auth/self");

            expect(response.statusCode).toBe(200);
        });
    });
});
