import generateNchmfWarning from "./generate-nchmf-warning";
import createChatbot from "./create-chatbot";

export default {
  GenerateNchmfWarning: {
    task: ({ strapi }) => {
      generateNchmfWarning();
    },
    options: {
      // rule: "0 0 * * *",  // Run every day at midnight
      rule: "*/5 * * * *", // Run every 5 minutes
      tz: "Asia/Ho_Chi_Minh",
    },
  },
  CreateChatbot: {
    task: ({ strapi }) => {
      createChatbot();
    },
    options: {
      // rule: "0 0 * * *", // Run every day at midnight
      rule: "*/5 * * * *", // Run every 5 minutes
      tz: "Asia/Ho_Chi_Minh",
    },
  },
};
