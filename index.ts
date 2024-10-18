import { GameDig, type QueryOptions } from "gamedig";
import createLogger from "pino";
import { KV } from "./kv";
import { queryConfigs, type workerConfig } from "./config";
import { normalizeCount } from "./util";

const logger = createLogger({ level: "debug" });

const spawnWorker = (config: workerConfig) => {
  const query = () => {
    logger.debug(config, "start query");

    GameDig.query(config)
      .then((state) => {
        KV.set(`${config.serverId}_last_query_successful`, "1");

        KV.set(`${config.serverId}_numplayers`, state.numplayers.toString());
        KV.set(`${config.serverId}_ping`, state.ping.toString());

        logger.debug(
          `numplayers{game="${config.type}", server_id="${config.serverId}"} ${state.numplayers}`
        );
        logger.debug(
          `ping{game="${config.type}", server_id="${config.serverId}"} ${state.ping}`
        );
      })
      .catch((error) => {
        KV.set(`${config.serverId}_last_query_successful`, "0");

        logger.error(error, config);

        const errorCount =
          normalizeCount(KV.get(`${config.serverId}_query_failure_count`)) + 1;

        KV.set(`${config.serverId}_query_failure_count`, errorCount.toString());
      });
  };

  setTimeout(() => {
    // initial query
    query();
  }, Math.random() * 1000);

  // I was doing set interval here, but there might be some gamedig bug where long running process not cool
};

for (let config of queryConfigs) {
  spawnWorker(config);
}
