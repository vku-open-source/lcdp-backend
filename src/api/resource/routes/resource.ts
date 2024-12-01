/**
 * resource router
 */

import { factories, Core } from "@strapi/strapi";

export default {
    routes: [
        {
            method: "GET",
            path: "/resource/hello",
            handler: "api::resource.resource.hello", // or 'plugin::plugin-name.controllerName.functionName' for a plugin-specific controller
            config: {
                auth: false,
            },
        },
        {
            method: "POST",
            path: "/resource/generate-eop",
            handler: "api::resource.resource.generateEOP",
            config: {
                auth: false,
            },
        },
    ],
};
