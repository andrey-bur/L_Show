import { NextFunction, Request, Response } from "express"

export class HttpError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

type ErrorResponseBody = {
  message: string
}

export function notFoundHandler(_req: Request, res: Response<ErrorResponseBody>): void {
  res.status(404).json({
    message: "Route not found"
  })
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response<ErrorResponseBody>,
  _next: NextFunction
): void {
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      message: "Invalid JSON body"
    })
    return
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      message: error.message
    })
    return
  }

  console.error("Unexpected server error", error)

  res.status(500).json({
    message: "Internal server error"
  })
}
