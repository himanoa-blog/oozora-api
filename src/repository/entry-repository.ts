import { Entry } from "../model/entry";

export interface EntryRepository {
  length(): Promise<number>;
  list(offsetId: number, limit: number): Promise<Entry[]>;
  resolve(id: number): Promise<Entry>;
}
