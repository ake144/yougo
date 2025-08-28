import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let details = null;

        if (error instanceof HttpException) {
          status = error.getStatus();
          const response = error.getResponse();
          
          if (typeof response === 'object' && response !== null) {
            message = (response as any).message || error.message;
            details = (response as any).error || null;
          } else {
            message = error.message;
          }
        } else if (error.name === 'ValidationError') {
          status = HttpStatus.BAD_REQUEST;
          message = 'Validation failed';
          details = error.message;
        } else if (error.code === 'ER_DUP_ENTRY') {
          status = HttpStatus.CONFLICT;
          message = 'Duplicate entry';
          // details = 'A record with this information already exists';
        } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
          status = HttpStatus.BAD_REQUEST;
          message = 'Referenced record not found';
          // details = 'The referenced record does not exist';
        }

        const errorResponse = {
          statusCode: status,
          message,
          timestamp: new Date().toISOString(),
          path: context.switchToHttp().getRequest().url,
          // ...(details && { details: details as string }),
        };

        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
} 