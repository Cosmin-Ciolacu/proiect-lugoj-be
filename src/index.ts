import "reflect-metadata";
import {createConnection, getCustomRepository} from "typeorm";
import {createExpressServer, useExpressServer, Action, getMetadataArgsStorage} from "routing-controllers";
import *  as express from "express";
import * as swaggerUi from "swagger-ui-express";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { getFromContainer, MetadataStorage } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import * as cors from "cors";
import {config} from "dotenv";
import {definedControllers} from "./controller";

config();

async function init(): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const connection = await createConnection({
            type: "mysql",
            host: process.env.MYSQL_HOST,
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            entities: [
              __dirname + "/entities/*.ts",
            ]
        });
        console.log("updating database...\n")
        await connection.synchronize();
        const app = express();
        app.use(cors());
        const server =  useExpressServer(app, {
            controllers: [__dirname + "/controller/*.ts"],
        });
        await generateSwagger();
        const swaggerDocument = require("../swagger/swagger.json");
        app.use(
          "/swagger",
          swaggerUi.serve,
          swaggerUi.setup(swaggerDocument)
        );
        resolve(server);
    })
}
const generateSwagger = async () => {
    const routingControllersOptions = {
      controllers: definedControllers,
      routePrefix: ""
    };
    const metadatas = (getFromContainer(MetadataStorage) as any)
      .validationMetadatas;
    const schemas = validationMetadatasToSchemas(metadatas);
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          bearerAuth: {
            scheme: "bearer",
            type: "http",
            bearerFormat: "JWT"
          }
        }
      },
      info: {
        title: "EduXXI NOTIFICATIONS API",
        version: "0.0.1",
        description: "API documentation"
      }
    });
    const fs = require("fs");
    const dir = "./swagger";
    !fs.existsSync(dir) && fs.mkdirSync(dir);
    const fileName = "./swagger/swagger.json";
    //const writeFile = promisify(fs.writeFile);
    // console.log('deleting old swagger file...');
    // const deleteFile = promisify(fs.unlink);
    // await deleteFile(fileName);
    console.log("generating new swagger file...");
    await fs.writeFileSync(fileName, JSON.stringify(spec));
  };

init()
    .then(app => {
        app.listen(process.env.PORT || 5000, () => console.log("server up"))
    })