import type { QueryOptions } from "gamedig";
export type workerConfig = QueryOptions & { serverId: string };

import { parse } from "yaml";

import fs from "fs";

export const queryConfigs: workerConfig[] = parse(
  fs.readFileSync("./config.yml", "utf-8")
);

const _configDefaults = {
  HOST: "127.0.0.1",
  PORT: "3000",
};

export const appConfig = {
  get HOST() {
    return process.env.HOST || _configDefaults.HOST;
  },

  get PORT() {
    return parseInt(process.env.PORT || _configDefaults.PORT);
  },
};
