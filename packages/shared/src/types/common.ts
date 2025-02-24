import { ProjectTemplatePropertyTypes } from "./project";

export type ContentRefValue = {
  getContent: () => string;
};

export type FormItemContentRefValue<T> = {
  getContent: () => T;
  validate: () => boolean;
};

export type DynamicFormItemContentRefValue<T> = {
  getContent: () => T;
  validate: () => boolean;
  type: ProjectTemplatePropertyTypes;
};
