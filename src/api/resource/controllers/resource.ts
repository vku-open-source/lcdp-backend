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
    // 2. generate EOP from dify
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
    console.log("vndmsData", vndmsData);
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

    const floodData = `${vndmsData}`;

    const eopRes = await fetch(
      `${strapi.config.get("server.n8n.url")}/webhook/generate-eop`,
      {
        method: "POST",
        body: JSON.stringify({
          floodData,
          resourceData,
        }),
      }
    );
    const eop = ((await eopRes.json()) as { message: { message: string } })
      .message;

    const res = await strapi.service("api::eop.eop").create({
      data: {
        content: eop,
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
        Body request {
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

    const eopTaskRes = await fetch(
      `${strapi.config.get("server.n8n.url")}/webhook/generate-task-eop`,
      {
        method: "POST",
        body: JSON.stringify({
          eop: content,
          floodData,
          resourceData,
        }),
      }
    );
    const eopTasks = (
      (await eopTaskRes.json()) as {
        message: {
          tasks: {
            priority: string;
            description: string;
            location: string;
            resourceNeeded: string[];
          }[];
        };
      }
    ).message.tasks;

    const finalTasks = [];

    for (const task of eopTasks) {
      finalTasks.push(
        await strapi.service("api::eop-task.eop-task").create({
          data: {
            ...task,
            eop: {
              connect: eopId,
            },
          },
        })
      );
    }

    ctx.body = {
      data: {
        ...result,
        tasks: finalTasks,
      },
    };
  },
};
