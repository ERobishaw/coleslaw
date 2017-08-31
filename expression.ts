import {ExpressionInterface} from "./expressions/expression-interface";
import {Any} from "./lambdas/any";
import {ValueExpression} from "./expressions/value-expression";
import {UnaryExpression} from "./expressions/unary-expression";
import {PropertyExpression} from "./expressions/property-expression";
import {Contains} from "./methods/contains";
import {MethodExpression} from "./expressions/method-expression";
import {Now} from "./methods/now";
import {Trim} from "./methods/trim";
import {NotEquals} from "./filters/not-equals";
import {Or} from "./filters/or";
import {Subtract} from "./filters/subtract";
import {Cast} from "./methods/cast";
import {Multiply} from "./filters/multiply";
import {Modulo} from "./filters/modulo";
import {Length} from "./methods/length";
import {LessThan} from "./filters/lt";
import {GreaterThanOrEqualTo} from "./filters/gte";
import {GreaterThan} from "./filters/gt";
import {LessThanOrEqualTo} from "./filters/lte";
import {Equals} from "./filters/equals";
import {Add} from "./filters/add";
import {And} from "./filters/and";
import {Divide} from "./filters/divide";

export class Expression {
    public static add(left: number, right: number): ExpressionInterface
    public static add(left: ExpressionInterface, right: number): ExpressionInterface
    public static add(left: any, right: number) {
        left = Expression.expressionOrValue(left);
        return new Add(left, new ValueExpression(right));
    }

    public static and(left: ExpressionInterface, right: ExpressionInterface): ExpressionInterface {
        return new And(left, right);
    }

    public static divide(left: number, right: number): ExpressionInterface
    public static divide(left: ExpressionInterface, right: number): ExpressionInterface
    public static divide(left: any, right: number) {
        left = Expression.expressionOrValue(left);
        return new Divide(left, new ValueExpression(right));
    };

    public static equals<Type, T>(param: (type: Type) => T, value: ExpressionInterface): ExpressionInterface
    public static equals<Type, T>(param: (type: Type) => T, value: T): ExpressionInterface
    public static equals<Type, T>(param: (type: Type) => T, value: any): ExpressionInterface
    public static equals<Type, T>(param: ExpressionInterface, value: any)
    public static equals<Type, T>(param: any, value: any) {
        let left: any;

        if (param.accept) {
            left = param;
        } else {
            left = new PropertyExpression(Expression.nameof(param));
        }

        let right: any;

        // This allows a null value to be passed in
        if (value) {
            if (value.accept) {
                right = value;
            } else {
                right = new ValueExpression(value);
            }
        } else {
            right = new PropertyExpression('null');
        }

        return new Equals(left, right);
    }

    public static gt<Type, T>(left: (type: Type) => T, value: any): ExpressionInterface
    public static gt(left: ExpressionInterface, value: any): ExpressionInterface
    public static gt(left: any, value: any): ExpressionInterface {
        left = Expression.expressionOrValue(left);
        return new GreaterThan(left, new ValueExpression(value));
    }

    public static gte<Type, T>(left: (type: Type) => T, value: any): ExpressionInterface
    public static gte(left: ExpressionInterface, value: any): ExpressionInterface
    public static gte(left: any, value: any): ExpressionInterface {
        left = Expression.expressionOrValue(left);
        return new GreaterThanOrEqualTo(left, new ValueExpression(value));
    }

    public static lt<Type, T>(left: (type: Type) => T, value: any): ExpressionInterface
    public static lt(left: ExpressionInterface, value: any): ExpressionInterface
    public static lt(left: any, value: any): ExpressionInterface {
        left = Expression.expressionOrValue(left);
        return new LessThan(left, new ValueExpression(value));
    }

    public static lte<Type, T>(left: (type: Type) => T, value: any): ExpressionInterface
    public static lte(left: ExpressionInterface, value: any): ExpressionInterface
    public static lte(left: any, value: any): ExpressionInterface {
        left = Expression.expressionOrValue(left);
        return new LessThanOrEqualTo(left, new ValueExpression(value));
    }

    public static len<Type, T>(param: (type: Type) => T): ExpressionInterface {
        let propName = Expression.nameof(param);
        return new Length(new PropertyExpression(propName));
    }

    public static mod(left: number, right: number): ExpressionInterface {
        return new Modulo(new ValueExpression(left), new ValueExpression(right));
    }

    public static multiply(left: number, right: number): ExpressionInterface
    public static multiply(left: ExpressionInterface, right: number): ExpressionInterface
    public static multiply(left: any, right: number): ExpressionInterface {
        left = Expression.expressionOrValue(left);
        return new Multiply(left, new ValueExpression(right));
    }

    public static nameof<Type, T>(param: (type: Type) => T): string {
        let pattern = /\.([a-zA-Z0-9_]+)/g;
        let results = (param + "").match(pattern);

        if (results == null) {
            throw new Error(`Cannot find return type for param (value: ${param})`);
        }

        let returnValue = results.join();

        // This will replace all periods with nothing
        return returnValue.split(".").join("");
    }

    public static subNameOf<Type, T>(param: (type: Type) => T, expression: string): string {
        let pattern = /\.[a-zA-Z0-9_]+.[a-zA-Z0-9_]+/g;
        let results = (param + "").match(pattern);
        let returnValues: string[] = [];

        if (results == null) {
            throw new Error(`Cannot find return type for param (value: ${param})`);
        }

        results.forEach(result => {
            let object = result.substring(1, result.length);

            if (object.indexOf(".") > 0) {
                returnValues.push(object.replace(".", "(" + expression + "=") + ")");
            } else {
                returnValues.push(object);
            }
        });

        return returnValues.join();
    }

    public static not_equals<Type, T>(param: (type: Type) => T, value: ExpressionInterface): ExpressionInterface
    public static not_equals<Type, T>(param: (type: Type) => T, value: T): ExpressionInterface
    public static not_equals<Type, T>(param: (type: Type) => T, value: any): ExpressionInterface {
        let propName = Expression.nameof(param);
        let right: any;

        if (value instanceof MethodExpression) {
            right = value;
        } else {
            right = new ValueExpression(value);
        }

        return new NotEquals(new PropertyExpression(propName), right);
    }

    public static or(left: ExpressionInterface, right: ExpressionInterface): ExpressionInterface {
        return new Or(left, right);
    }

    public static subtract(left: number, right: any): ExpressionInterface
    public static subtract(left: ExpressionInterface, right: any): ExpressionInterface
    public static subtract(left: any, right: any): ExpressionInterface {
        left = Expression.expressionOrValue(left);
        return new Subtract(left, new ValueExpression(right));
    }

    public static cast<T, Type>(type: string, param?: (type: Type) => T): ExpressionInterface {
        let exps: ExpressionInterface[] = [];

        if (param) {
            let propName = Expression.nameof(param);
            exps.push(new PropertyExpression(propName));
        }

        exps.push(new PropertyExpression(type));

        return exps.length === 2 ? new Cast(exps[0], exps[1]) : new Cast(exps[0]);
    }

    public static top(param: number): ExpressionInterface {
        if (!param || param < 0) {
            throw new RangeError(`Parameter must be greater than zero (value: ${param})`);
        }

        return new UnaryExpression(new ValueExpression(param));
    }

    public static skip(param: number): ExpressionInterface {
        if (!param || param < 0) {
            throw new RangeError(`Parameter must be greater than zero (value: ${param})`);
        }

        return new UnaryExpression(new ValueExpression(param));
    }

    public static trim(v: string): ExpressionInterface {
        return new Trim(new ValueExpression(v));
    }

    public static now(): ExpressionInterface {
        return new Now();
    }

    public static contains<Type, T>(param: (type: Type) => T, value: T): ExpressionInterface
    public static contains<Type, T>(param: (type: Type) => T, value: ExpressionInterface): ExpressionInterface
    public static contains<Type, T>(param: (type: Type) => T, value: any): ExpressionInterface {
        let propName = Expression.nameof(param);
        let right: any;

        if (value instanceof MethodExpression) {
            right = value;
        } else {
            right = new ValueExpression(value);
        }

        return new Contains(new PropertyExpression(propName), right);
    }

    public static any<Type, T>(param: (type: Type) => T, ex: ExpressionInterface): ExpressionInterface {
        let propName = Expression.nameof(param);
        return new Any(new PropertyExpression(propName), ex);
    }

    private static expressionOrValue(value: any): ExpressionInterface {
        if (typeof value === "function") {
            value = new PropertyExpression(Expression.nameof(value));
        } else if (!value.accept) {
            value = new ValueExpression(value)
        }

        return value;
    }
}
