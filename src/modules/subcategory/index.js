import subCategoryRouter from "./routes/index.js";

const subcategoryModule = {
  init: (app) => {
    app.use("/api/v1", subCategoryRouter);
    console.log("[module]: subcategory module loaded");
  },
};

export default subcategoryModule;
