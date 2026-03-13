import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get("user-agent") || "";
    const start = Date.now();

    res.on("finish", () => {
      const { statusCode } = res;
      const contentLength = res.get("content-length");
      const responseTime = Date.now() - start;

      console.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength || 0} - ${responseTime}ms - ${ip} ${userAgent}`,
      );
    });

    next();
  }
}
