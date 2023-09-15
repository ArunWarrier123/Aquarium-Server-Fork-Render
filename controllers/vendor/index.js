import vendorRouter from "./routes/index.js";

const vendorModule = {
  init: (app) => {
    app.use("/api/v1", vendorRouter);
    console.log("[module]: vendor module loaded");
  },
};

export default vendorModule;
