const debug = require("debug")("app");
const { PORT } = require("./config");
const app = require("./app");

app.listen(PORT, () => {
  debug(`Web server is running ${PORT}`);
});
