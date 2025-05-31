// sql-error.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    ConflictException,
    InternalServerErrorException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

export const SQL_ERROR_CODES = {
    ER_DUP_ENTRY: new ConflictException('Duplicate entry, unique constraint violation.'),
    ER_NO_REFERENCED_ROW_2: new BadRequestException('Foreign key constraint error.'),
    ER_DATA_TOO_LONG: new BadRequestException('Data too long for column.'),
    ER_BAD_NULL_ERROR: new BadRequestException('Not null constraint error.'),
    ER_PARSE_ERROR: new BadRequestException('SQL syntax error.'),
    ER_LOCK_DEADLOCK: new InternalServerErrorException('Deadlock error.'),
    ER_LOCK_WAIT_TIMEOUT: new InternalServerErrorException('Lock wait timeout exceeded.'),
    ER_BAD_FIELD_ERROR: new BadRequestException('Bad field error.'),
    ER_NO_SUCH_TABLE: new BadRequestException('No such table.'),
    ER_ACCESS_DENIED_ERROR: new BadRequestException('Access denied.'),
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: new BadRequestException('Truncated wrong value for field.'),
    ER_ROW_IS_REFERENCED_2: new BadRequestException(
        'Cannot delete or update a parent row: a foreign key constraint fails',
    ),
    DEFAULT: new InternalServerErrorException('An unexpected database error occurred.'),
};

@Injectable()
export class SqlErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const req = context.switchToHttp().getRequest();

        return next.handle().pipe(
            catchError((error) => {
                // Check if the error is a SQL QueryFailedError from TypeORM
                if (error instanceof QueryFailedError) {
                    const sqlMessage = error.message;
                    const sqlCode = (error as any).code; // TypeORM uses a code property
                    if (req) {
                        Logger.error(
                            `${req.method} ${req.url} ${Date.now() - now}ms SQL Error: ${sqlMessage}`,
                            error.query,
                            error.stack,
                            sqlCode,
                            'SqlErrorInterceptor',
                        );
                    } else {
                        Logger.error(
                            ` SQL Error: ${sqlMessage}`,
                            error.query,
                            error.stack,
                            sqlCode,
                            'SqlErrorInterceptor',
                        );
                    }

                    // Customize response based on SQL error code
                    //Mysql errors
                    throw SQL_ERROR_CODES[sqlCode] ?? SQL_ERROR_CODES.DEFAULT;
                }

                // If error is not a SQL error, rethrow it
                throw error;
            }),
        );
    }
}
