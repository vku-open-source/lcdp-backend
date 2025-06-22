import server from "../../../../config/server";
import { extractContentFromTags } from "../../../libs/extract-content-tags";
import resource from "../routes/resource";
import { Modules } from "@strapi/strapi";

const { sanitize, validate } = strapi.contentAPI;

export default {
    async hello(ctx, next) {
        ctx.body = "Hello world";
    },
    async generateEOP(ctx) {
        // 1. get body data
        // 2. generate EOP from AI service
        // 3. save to database
        // 4. return response

        const body = ctx.request.body;
        if (!body || (body && (!body?.dateFrom || !body?.dateTo))) {
            ctx.status = 400;
            ctx.body = {
                message: "dateFrom and dateTo are required",
            };
            return;
        }
        const { dateFrom, dateTo } = body;

        // strapi call another api
        const vndmsService = strapi.service("api::vndms-warning.vndms-warning");
        // filters[datetime][$gte]={{this.params.dateFrom}}&filters[datetime][$lte]={{this.params.dateTo}}
        let vndmsData = await vndmsService.find({
            filters: {
                datetime: {
                    $gte: new Date(dateFrom),
                    $lte: new Date(dateTo),
                },
            },
        });

        vndmsData = vndmsData.results
            .map((item) =>
                item.data.map((e) => ({
                    province: e.label,
                    water_level: e.water_level,
                    warning_type: e.warning_type,
                    warning_level: e.warning_level,
                }))
            )
            .flat();

        const goodsSupplyService = await strapi.service(
            "api::goods-supply.goods-supply"
        );
        let resourceData = await goodsSupplyService.find({
            // filters: {
            //   datetime: {
            //     $gte: new Date(dateFrom),
            //     $lte: new Date(dateTo),
            //   },
            // },
        });
        resourceData = resourceData.results
            .map((item) => `${item.name}, Số lượng: ${item.quantity}`)
            .join("\n");

        let floodData = `${vndmsData}`;

        // mock data if flood data and resource data is empty
        if (!floodData || !resourceData) {
            floodData = "Mock flood data";
            resourceData = "Mock resource data";
        }

        console.log("body", {
            flood_data: floodData,
            resource_data: resourceData,
        });

        // mock data if flood data and resource data is empty

        if (!floodData || !resourceData) {
            ctx.status = 400;
            ctx.body = {
                message: "Flood data or resource data is empty",
            };
            return;
        }

        // Default location - can be enhanced to get from request or config
        const location = "Khu vực bị ảnh hưởng lũ lụt";

        // Call the new AI service endpoint
        const eopRes = await fetch(
            `${strapi.config.get("server.ai.url")}/api/v1/ai/generate-eop`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flood_data: floodData,
                    resource_data: resourceData,
                    location: location,
                }),
            }
        );

        if (!eopRes.ok) {
            ctx.status = 500;
            ctx.body = {
                message: "Failed to generate EOP from AI service",
                error: await eopRes.text(),
            };
            return;
        }

        const eopResponse = (await eopRes.json()) as {
            status: string;
            eop_report: string;
            metadata: {
                location: string;
                generated_at: string;
                model_used: string;
            };
        };

        if (eopResponse.status !== "success") {
            ctx.status = 500;
            ctx.body = {
                message: "AI service returned error",
                error: eopResponse,
            };
            return;
        }

        const eop = eopResponse.eop_report;

        const res = await strapi.service("api::eop.eop").create({
            data: {
                content: eop,
                flood_data: floodData,
                resource_data: resourceData,
                location: location,
                metadata: eopResponse.metadata,
            },
        });

        ctx.body = {
            data: res,
        };
    },

    async confirmEOP(ctx) {
        // 1. get body data
        // 2. update EOP
        // 3. generate task list from AI service
        // 4. return response

        /*
        Body request {
            eopId: string
            content: string
            }
    */

        const { eopId, content } = ctx.request.body;

        // console.log(strapi.service("api::eop.eop"));
        // const eop = await strapi.service("api::eop.eop").findFirst();
        // console.log("eop", eop);

        const eop = await strapi.documents("api::eop.eop").findFirst({
            filters: {
                id: {
                    $eq: eopId,
                },
            },
        });
        console.log("eop", eop);

        if (!eop) {
            ctx.status = 404;
            ctx.body = {
                message: "EOP not found",
            };
            return;
        }

        // const result = await strapi.service("api::eop.eop").update(eopId, {
        //     data: {
        //         content,
        //         draft: false,
        //     },
        // });
        const result = await strapi.documents("api::eop.eop").update({
            documentId: eop.documentId,
            data: {
                content,
                draft: false,
            },
        });

        const floodData = eop.flood_data;
        const resourceData = eop.resource_data;

        console.log("body", {
            emergency_operations_plan: content,
            flood_data: floodData,
            resource_data: resourceData,
        });

        // Call the new AI service endpoint for task generation
        const eopTaskRes = await fetch(
            `${strapi.config.get("server.ai.url")}/api/v1/ai/generate-tasks`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emergency_operations_plan: content,
                    flood_data: floodData,
                    resource_data: resourceData,
                }),
            }
        );

        if (!eopTaskRes.ok) {
            ctx.status = 500;
            ctx.body = {
                message: "Failed to generate tasks from AI service",
                error: await eopTaskRes.text(),
            };
            return;
        }

        const taskResponse = (await eopTaskRes.json()) as {
            status: string;
            tasks: {
                priority: string;
                description: string;
                location: string;
                resource_needed: string;
            }[];
            total_tasks: number;
            metadata: {
                generated_at: string;
                model_used: string;
            };
        };

        if (taskResponse.status !== "success") {
            ctx.status = 500;
            ctx.body = {
                message: "AI service returned error for task generation",
                error: taskResponse,
            };
            return;
        }

        const eopTasks = taskResponse.tasks;
        console.log("eopTasks", eopTasks);

        const finalTasks = [];

        for (const task of eopTasks) {
            finalTasks.push(
                await strapi.documents("api::eop-task.eop-task").create({
                    data: {
                        priority: task.priority,
                        description: task.description,
                        location: task.location,
                        resource_needed: task.resource_needed,
                        isDone: false,
                        eop: eop.documentId,
                        // eop: {
                        //     documentId: eop.documentId,
                        // },
                    },
                })
            );
        }

        ctx.body = {
            data: {
                ...result,
                tasks: finalTasks,
                task_metadata: {
                    total_tasks: taskResponse.total_tasks,
                    metadata: taskResponse.metadata,
                },
            },
        };
    },
};
