const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
  app.use(
    "/api/ws",
    createProxyMiddleware({
      target: "ws://localhost:8080",
      changeOrigin: true,
      ws: true,
      logLevel: "debug",
    })
  )
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      logLevel: "debug",
    })
  )
}
