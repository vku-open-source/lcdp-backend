import { extractContentFromTags } from "../../../libs/extract-content-tags";

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

        await strapi.service("api::eop.eop").create({
            data: {
                content: answer,
            },
        });

        ctx.body = {
            data: answer,
        };
    },
};
