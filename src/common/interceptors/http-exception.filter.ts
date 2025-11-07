import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const message =
      typeof errorResponse === 'string' ? errorResponse : (errorResponse as { message: string | string[] }).message;

    const finalMessage = Array.isArray(message) ? message.join(', ') : message;

    response.status(status).json({
      success: false,
      statusCode: status,
      message: finalMessage || exception.message,
      data: null,
    });
  }
}
