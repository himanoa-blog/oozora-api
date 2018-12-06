import * as mysql from "promise-mysql";

import { EntryRepository } from "./entry-repository";
import { Entry, parseEntry } from "../model/entry";

export class EntryNotFoundException extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class MySqlEntryRepository implements EntryRepository {
  constructor(private readonly conn: mysql.Pool) {}

  async list(offsetId: number, limit: number): Promise<Entry[]> {
    const query = "SELECT * FROM `entries` ORDER BY `id` DESC LIMIT ?, ?;";
    const result = await this.conn.query(query, [offsetId, limit]);
    return await Promise.all(result.map(val => parseEntry(val)));
  }

  async resolve(id: number): Promise<Entry> {
    const query = "SELECT * FROM `entries` WHERE `id`=?";
    const result = await this.conn.query(query, id);
    if (result[0] === undefined) {
      throw new EntryNotFoundException(`${id} is not found`);
    }
    return (await Promise.all(result.map(parseEntry)))[0];
  }
}
