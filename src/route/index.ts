import * as Express from "express";
import { wrapAsync } from "./error-handler";
import entry from "./entry"

const router = Express.Router();

router.get("/health", async (req, res) => {
  res.send("live!");
});

const endPoints = [entry, { path: "/", router }];

function applyRouter(app: Express.Application) {
  return endPoints.reduce(
    (app, endPoint) => app.use(endPoint.path, endPoint.router),
    app
  );
}

export default applyRouter;
