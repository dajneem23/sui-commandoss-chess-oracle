import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import  _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function processObj(data: any, objectFields: string[], propFields: string[], options: any) {
    const keepPath = options && _.has(options, 'keepPath') ? options.keepPath : true;

    const exclude = options && _.has(options, 'exclude') ? options.exclude : false;

    let item: Record<string, unknown> = {};

    if (propFields.length > 0 || exclude) {
        item = !exclude ? _.pick(data, propFields) : _.omit(data, propFields);
    }

    if (objectFields.length > 0) {
        const mapOb: any = {};

        _.forEach(objectFields, (f) => {
            const token = f.replace(new RegExp(/\[\]/gm), '').split('.');

            const obj: any = _.head(token);

            const prop = _.tail(token).join('.');

            if (mapOb[obj]) {
                mapOb[obj].push(prop);
            } else {
                mapOb[obj] = [prop];
            }
        });

        _.forEach(mapOb, (prop, obj) => {
            if (_.isArray(data[obj]) || _.isObject(data[obj])) {
                const returned = deepPick(data[obj], prop, options);

                if (keepPath || !_.isEmpty(returned)) {
                    item[obj] = returned;
                } else if (exclude) {
                    delete item[obj];
                }
            } else {
                item[obj] = data[obj];
            }
        });
    }

    return item;
}

function deepPick(
    data: Record<string, any>[] | Record<string, any> | any,
    inputFields: string | string[],
    options: { keepPath?: boolean; exclude?: boolean } = {},
) {
    const keepPath = options && _.has(options, 'keepPath') ? options.keepPath : true;

    const fields = _.isArray(inputFields) ? inputFields : [inputFields];

    const objectFields = _.filter(fields, (n) => n.indexOf('.') !== -1);

    const propFields = _.difference(fields, objectFields);

    let result: any;

    if (_.isArray(data)) {
        result = [];

        _.forEach(data, (d) => {
            const returned = processObj(d, objectFields, propFields, options);

            if (keepPath || !_.isEmpty(returned)) {
                result.push(returned);
            }
        });
    } else if (_.isObject(data)) {
        result = processObj(data, objectFields, propFields, options);
    } else {
        result = data;
    }

    return result;
}

export interface Response<T> {
    data: T;
}

@Injectable()
export class CustomReturnFieldsInterceptor<T> implements NestInterceptor<T, Response<T>> {
    logger = new Logger();

    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const req = context.switchToHttp().getRequest();
        const requestLogger = {
            body: req.body,
            params: req.params,
            query: req.query,
            url: req.originalUrl,
        };
        this.logger.log(`request: ${JSON.stringify(requestLogger)}`);

        const now = Date.now();

        return next.handle().pipe(
            map((data) => {
                this.logger.log(`Consumming Time... ${Date.now() - now}ms`);
                this.logger.log(`response: ${JSON.stringify(data)}`);

                return data;
            }),
        );
    }
}
