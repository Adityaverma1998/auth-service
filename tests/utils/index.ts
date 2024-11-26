import { DataSource } from "typeorm";
import { User } from "../../src/entity/User";

export const turncateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas;

    for (const enitity of entities) {
        const repository = connection.getRepository(enitity.name);
        await repository.clear();
    }
};

export const isJwt = (token: String | null): boolean => {
    let isJwtValid = false;
    const parts = token?.split(".");
    if (parts?.length != 3 || token === null) {
        return isJwtValid;
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8");
        });
        isJwtValid = true;

        return isJwtValid;
    } catch (err) {
        return isJwtValid;
    }
};
