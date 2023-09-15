import categoryRouter from "./routes/index.js";


const categoryModule = {
  init: (app) => {
    app.use("/api/v1", categoryRouter);
    console.log("[module]: category module loaded");
  },
};

export default categoryModule;
