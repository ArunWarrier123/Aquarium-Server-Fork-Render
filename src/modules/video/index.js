import videoRouter from "./routes/index.js";

const videoModule = {
  init: (app) => {
    app.use("/api/v1", videoRouter);
    console.log("[module]: story module loaded");
  },
};

export default videoModule;
