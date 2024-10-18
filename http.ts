import Fastify from "fastify";

import { appConfig, queryConfigs } from "./config";
import { KV } from "./kv";
import { normalizeCount } from "./util";

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async function handler(request, reply) {
  return reply.redirect("/metrics");
});

fastify.get("/metrics", async function handler(request, reply) {
  const metricsBody = [];
  metricsBody.push("# TYPE gamedig_numplayers gauge");
  metricsBody.push("# TYPE gamedig_ping gauge");

  for (let config of queryConfigs) {
    const numplayers = normalizeCount(KV.get(`${config.serverId}_numplayers`));
    const ping = normalizeCount(KV.get(`${config.serverId}_ping`));
    const queryFailureCount = normalizeCount(
      KV.get(`${config.serverId}_query_failure_count`)
    );
    const lastQuerySucessful = normalizeCount(
      KV.get(`${config.serverId}_last_query_successful`)
    );

    // const gameServerInstance: string = [config.host, config.port]
    //   .filter((l) => l !== undefined)
    //   .join(":");

    // gamedig_numplayers
    metricsBody.push(
      `gamedig_numplayers{game="${config.type}", server_id="${config.serverId}"} ${numplayers}`
    );
    // gamedig_ping
    metricsBody.push(
      `gamedig_ping{game="${config.type}", server_id="${config.serverId}"} ${ping}`
    );

    metricsBody.push(
      `gamedig_query_failure_count{game="${config.type}", server_id="${config.serverId}"} ${queryFailureCount}`
    );

    metricsBody.push(
      `gamedig_query_last_query_successful{game="${config.type}", server_id="${config.serverId}"} ${lastQuerySucessful}`
    );

    metricsBody.push("");
  }

  return reply.send(metricsBody.join("\n"));
});

export const start = async () => {
  // Run the server!
  try {
    await fastify.listen({ port: appConfig.PORT, host: appConfig.HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// counterstrike bug.. just start this here

start();
