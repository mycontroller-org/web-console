const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function (app) {
  app.use(
    "/api/ws",
    createProxyMiddleware({
      target: getEnvironmentValue("MC_PROXY_WEBSOCKET", "ws://localhost:8080"),
      changeOrigin: true,
      ws: true,
      logLevel: "debug",
    })
  )
  app.use(
    "/api",
    createProxyMiddleware({
      target: getEnvironmentValue("MC_PROXY_HTTP", "http://localhost:8080"),
      changeOrigin: true,
      logLevel: "debug",
    })
  )
}

const getEnvironmentValue = (varName, defaultValue) => {
  const value = process.env[varName]
  if (value !== undefined) {
    return value
  }
  return defaultValue
}
