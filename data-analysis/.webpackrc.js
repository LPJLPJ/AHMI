const NODE_ENV = process.env.NODE_ENV;
const publicPath = NODE_ENV === 'build' ? '/' : '/public/data-analysis/static/';
console.log('publicPath', publicPath);
export default {
  publicPath,
  proxy: {
    "/api": {
      "target": "http://localhost:3000/",
      "changeOrigin": true,
      "pathRewrite": {"^/api": "/"}
    }
  },
}
