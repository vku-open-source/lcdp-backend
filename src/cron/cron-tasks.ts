import generateNchmfWarning from "./generate-nchmf-warning";

export default {

    GenerateNchmfWarning: {
      task: ({ strapi }) => {
        generateNchmfWarning();
      },
      options: {
        rule: "0 0 * * *",  // Run every day at midnight
        // rule: "*/1 * * * *",  // Run every 1 minutes
        tz: "Asia/Ho_Chi_Minh",
      },
    },
  };