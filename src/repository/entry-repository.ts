import { Entry } from "../model/entry";

export interface EntryRepository {
  list(offset: number, limit: number): Promise<Entry[]>;
  resolve(id: number): Promise<Entry>;
}
