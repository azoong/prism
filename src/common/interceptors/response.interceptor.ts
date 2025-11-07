import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: true;
  statusCode: number;
  data: T;
  error: null;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<StandardResponse<T>> {
    const httpContext = context.switchToHttp();

    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data: T) => {
        return {
          success: true,
          statusCode: response.statusCode,
          data,
          error: null,
        };
      }),
    );
  }
}
