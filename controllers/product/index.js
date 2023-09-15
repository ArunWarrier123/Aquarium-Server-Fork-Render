import productRouter from "./routes/index.js";

const productModule = {
  init: (app) => {
    app.use("/api/v1", productRouter);
    console.log("[module]: product module loaded");
  },
};

export default productModule;
