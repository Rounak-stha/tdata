import { Node } from "prosemirror-model";
import { schema } from "../lib/schema";

export const extractTextFromJSONString = (jsonString: string) => {
  try {
    const json = JSON.parse(jsonString);
    return extractTextFromJSON(json);
  } catch (e) {
    console.log(e);
    return "";
  }
};

export const extractTextFromJSON = (json: Node): string => {
  const parsedDoc = schema.nodeFromJSON(json);
  return parsedDoc.textContent;
};
