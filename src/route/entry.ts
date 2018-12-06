import * as Express from "express";
import * as Joi from "joi";

import {
  MySqlEntryRepository,
  EntryNotFoundException
} from "../repository/mysql-entry-repository";
import { Entry } from "../model/entry";
import pool from "../infra/database/mysql";
import { wrapAsync } from "./error-handler";

const router = Express.Router();

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = await Joi.object()
      .keys({ id: Joi.number().required() })
      .validate(req.params);
    new MySqlEntryRepository(pool)
      .resolve(id)
      .then(entry => {
        res.status(200).json(entry);
      })
      .catch(err => {
        if (err instanceof EntryNotFoundException) {
          res.status(404).json({});
          return Promise.resolve();
        }
      });
  })
);

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const { offset, limit } = await Joi.object()
      .keys({
        offset: Joi.number().required(),
        limit: Joi.number().required()
      })
      .validate(req.query);
    const entry = await new MySqlEntryRepository(pool).list(offset, limit);
    res.status(200).json(entry);
  })
);

export default {
  path: "/entries",
  router
};
