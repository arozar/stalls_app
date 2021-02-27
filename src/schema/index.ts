import { buildSchemaSync, Resolver, Query } from "type-graphql";
import { ImageResolver } from "./image";
import { StallResolver } from "./stall";
import { authChecker } from "./auth";

export const schema = buildSchemaSync({
  resolvers: [ImageResolver, StallResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});
