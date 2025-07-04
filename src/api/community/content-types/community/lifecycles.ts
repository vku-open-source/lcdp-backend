import axios from "axios";
import type { Core } from "@strapi/strapi";

interface User {
  id: number;
  email: string;
  phone: string;
  allowNotification: {
    email: boolean;
    sms: boolean;
  };
}

interface Community {
  documentId: string;
  title: string;
  content: string;
  type: string;
  isAprroved: boolean;
}

const notificationServiceBaseURL =
  (strapi.config.get("server.notification.url") as string) ??
  `http://tap.sigconn.sbs:3010/api`;

const notificationApi = axios.create({
  baseURL: notificationServiceBaseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const checkIfNotificationIsAlert = (title: string) => {
  // using LLM to check if the title is an emergency alert
};

async function handleNotification(event: { result: Community }) {
  const { result } = event;

  if (result.type === "emergency_alert" && result.isAprroved === true) {
    // if (result.type === "emergency_alert") {
    try {
      // Lấy tất cả users từ Strapi
      const users = await strapi
        .query("plugin::users-permissions.user")
        .findMany({
          select: ["email", "phone", "allowNotification"],
        });
      // Chuẩn bị danh sách recipients
      const recipients = users
        .filter(
          (user) => user.allowNotification?.email || user.allowNotification?.sms
        )
        .map((user) => ({
          email: user.email,
          phone: user.phone,
          notification_channels: {
            email: user.allowNotification?.email || false,
            sms: user.allowNotification?.sms || false,
          },
        }));

      console.log("Recipients:", recipients);
      console.log("notificationServiceBaseURL:", notificationServiceBaseURL);
      // Chỉ gửi request nếu có ít nhất 1 recipient
      if (recipients.length > 0) {
        const notificationResponse = await notificationApi.post(
          "/notifications",
          {
            title: result.title,
            content: result.content,
            type: result.type,
            recipients,
          }
        );

        await strapi.documents("api::notification.notification").create({
          data: {
            community: result.documentId,
            title: result.title,
            content: result.content,
            recipients: recipients,
            noti_status:
              notificationResponse.status === 200 ? "sent" : "failed",
            sentAt: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error("Error sending notifications:", error.response);
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
