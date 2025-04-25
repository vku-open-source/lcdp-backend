// src/api/gateway/routes/gateway.js

export default {
    routes: [
      {
        method: 'POST',
        path: '/gateway/detail-rain',
        handler: 'gateway.detailRain',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  