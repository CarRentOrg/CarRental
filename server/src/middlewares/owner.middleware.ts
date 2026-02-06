import { Request, Response, NextFunction } from "express";

export const requireOwner = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Owner access only" });
  }

  next();
};
