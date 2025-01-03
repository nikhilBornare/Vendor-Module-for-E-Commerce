import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import { ApplicationError } from "../error-handler/applicationError";

export const validateRequest = (schema: Joi.ObjectSchema | Joi.ArraySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(new ApplicationError(message, 400));
    }
    next();
  };
};
