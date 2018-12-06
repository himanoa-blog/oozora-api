import applyRouter from "./";
import express from "express";

test("エラーにならないこと", () => {
  expect(applyRouter(express())).toBeDefined();
  console.log("poe");
});
