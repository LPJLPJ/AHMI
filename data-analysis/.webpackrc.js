export default {
  proxy: {
    "/api": {
      "target": "http://localhost:3000/",
      "changeOrigin": true,
      "pathRewrite": { "^/api/project": "/project" }
    }
  },
}