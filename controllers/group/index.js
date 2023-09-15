import groupRouter from "./routes/index.js";

const groupModule = {
  init: (app) => {
    app.use("/api/v1", groupRouter);
    console.log("[module]: group module loaded");
  },
};

export default groupModule;
