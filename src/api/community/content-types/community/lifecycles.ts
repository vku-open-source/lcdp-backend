import axios from "axios";
import type { Core } from "@strapi/strapi";

interface Community {
  title: string;
  content: string;
  type: string;
  notificationChannels: {
    email: boolean;
    sms: boolean;
  };
}

const notificationServiceBaseURL = `http://127.0.0.1:3000/api`;

const notificationApi = axios.create({
  baseURL: notificationServiceBaseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function handleNotification(event: { result: Community }) {
  const { result } = event;

  if (result.type === "emergency_alert") {
    try {
      await notificationApi.post("/notifications", {
        title: result.title,
        content: result.content,
        type: result.type,
        notification_channels: result.notificationChannels,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
}

export default {
  async afterCreate(event: { result: Community }) {
    await handleNotification(event);
  },
  async afterUpdate(event: { result: Community }) {
    await handleNotification(event);
  },
};
