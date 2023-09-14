import storyRouter from "./routes/index.js";

const storyModule = {
  init: (app) => {
    app.use("/api/v1", storyRouter);
    console.log("[module]: story module loaded");
  },
};

export default storyModule;
