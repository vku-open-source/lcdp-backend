import { extractContentFromTags } from "../../../libs/extract-content-tags";
import resource from "../routes/resource";

const { sanitize, validate } = strapi.contentAPI;

export default {
    async hello(ctx, next) {
        ctx.body = "Hello world";
    },
    async generateEOP(ctx) {
        // 1. get body data
        // 2. generate EOP from dify
        // 3. save to database
        // 4. return response
        // toekn: app-kJRC4dEhYexZtG2rFvWQGanG

        const { floodData, resourceData } = ctx.request.body;

        const response = await fetch("https://api.dify.ai/v1/chat-messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer app-kJRC4dEhYexZtG2rFvWQGanG",
            },
            body: JSON.stringify({
                inputs: {
                    FLOOD_DATA: floodData,
                    RESOURCE_DATA: resourceData,
                },
                user: "test",
                query: "give me EOP",
                response_mode: "blocking",
            }),
        });
        const data: { answer?: string } = await response.json();
        const answer = extractContentFromTags(data?.answer, "EOP").join("\n\n");

        const res = await strapi.service("api::eop.eop").create({
            data: {
                content: answer,
                flood_data: floodData,
                resource_data: resourceData,
            },
        });

        ctx.body = {
            data: res,
        };
    },
    async confirmEOP(ctx) {
        // 1. get body data
        // 2. update EOP
        // 3. generate task list
        // 4. return response

        /*
        Bod request {
            eopId: string
            content: string
        }
        */

        const { eopId, content } = ctx.request.body;

        const eop = await strapi.service("api::eop.eop").findOne(eopId);

        if (!eop) {
            ctx.status = 404;
            ctx.body = {
                message: "EOP not found",
            };
            return;
        }

        const result = await strapi.service("api::eop.eop").update(eopId, {
            data: {
                content,
                draft: false,
            },
        });

        const floodData = eop.flood_data;
        const resourceData = eop.resource_data;

        const response = await fetch("https://api.dify.ai/v1/chat-messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer app-9iNnwMF2T3avpwRUAAcZlL50",
            },
            body: JSON.stringify({
                inputs: {
                    EMERGENCY_OPERATIONS_PLAN: content,
                    FLOOD_DATA: floodData,
                    RESOURCE_DATA: resourceData,
                },
                user: "test",
                query: "give me task list",
                response_mode: "blocking",
            }),
        });
        const data: { answer?: string } = await response.json();
        const answer = data?.answer || "";

        const tasks = extractContentFromTags(answer, "task");

        for (const task of tasks) {
            const finalTask = {
                priority: extractContentFromTags(task, "priority")[0],
                description: extractContentFromTags(task, "description")[0],
                location: extractContentFromTags(task, "location")[0],
                resourceNeeded: extractContentFromTags(
                    task,
                    "resources_needed"
                )[0],
            };
            await strapi.service("api::eop-task.eop-task").create({
                data: {
                    ...finalTask,
                    eop: {
                        connect: eopId,
                    },
                },
            });
        }

        ctx.body = {
            data: result,
        };
    },
};
