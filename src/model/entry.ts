import * as Joi from "joi";
import Markdown from "markdown-it"
import hljs from 'highlight.js';

export interface Entry {
  id: number;
  title: string;
  body: string;
  published: boolean;
  updatedAt: Date;
  createdAt: Date;
  userId: number;
}

export async function parseEntry(
  obj: { [keys in string]: any }
): Promise<Entry> {
  const validator = Joi.object()
    .keys({
      id: Joi.number().required(),
      title: Joi.string().required(),
      body: Joi.string().required(),
      published: Joi.boolean().required(),
      userId: Joi.number().required(),
      updatedAt: Joi.date().required(),
      createdAt: Joi.date().required()
    })
    .rename("user_id", "userId")
    .rename("updated_at", "updatedAt")
    .rename("created_at", "createdAt");
  const result = await Joi.validate(obj, validator).catch(err => {
    throw err;
  });
  return result as Entry;
}

export function bodyToHtml(body: string): string {
  const converter = new Markdown("commonmark", {
    linkify: true,
    highlight: function (str, lang) {
      // Use: https://github.com/markdown-it/markdown-it#syntax-highlighting
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }
      return ''; // use external default escaping
      }
  })
  return converter.render(body)
}

export const toJson = (entry: Entry): Entry => ({ ...entry, ...{ body: bodyToHtml(entry.body)} })
