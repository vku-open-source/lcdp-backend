import cronTasks from "../src/cron/cron-tasks";

export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
  n8n: {
    url: env("N8N_URL", "https://n8n.hoangtrung1801.live"),
  },
});
