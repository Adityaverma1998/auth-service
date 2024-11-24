import { DataSource } from "typeorm";
import { User } from "../../src/entity/User";

export const turncateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas;

    for (const enitity of entities) {
        const repository = connection.getRepository(enitity.name);
        await repository.clear();
    }
};
