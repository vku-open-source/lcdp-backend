// src/api/gateway/controllers/gateway.js

import FormData from "form-data";

export default {
    async detailRain(ctx) {
        const { id, source, timeSelect } = ctx.request.body;

        if (!id || !source) {
            return ctx.badRequest("Missing id or source");
        }

        const formData = new FormData();
        formData.append("id", parseInt(id, 10));
        formData.append("source", source);
        formData.append("timeSelect", timeSelect || 7);

        try {
            const fetch = (await import("node-fetch")).default;
            const response = await fetch(
                "http://vndms.dmc.gov.vn/home/detailRain",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                return ctx.throw(response.status, "Failed to fetch from VNDMS");
            }
            console.log("Fetched from VNDMS");
            const data = await response.json();
            return ctx.send(data);
        } catch (err) {
            console.error("Error fetching from VNDMS:", err);
            return ctx.internalServerError("Error communicating with upstream");
        }
    },
};
