// joi-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { JoiPipeValidationException } from 'nestjs-joi';

@Catch(JoiPipeValidationException)
export class JoiExceptionFilter implements ExceptionFilter {
    catch(exception: JoiPipeValidationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const validationErrors = exception.joiValidationError.details.map((error) => ({
            field: error.path.join('.'),
            message: error.message,
        }));

        response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: validationErrors,
        });
    }
}
