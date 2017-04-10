import {BinaryExpression} from "./binary-expression";
import {UnaryExpression} from "./unary-expression";
import {ValueExpression} from "./value-expression";
import {MethodExpression} from "./method-expression";
import {PropertyExpression} from "./property-expression";
import {LambdaExpression} from "./lambda-expression";

export interface ExpressionVisitor {
  visit(expression: BinaryExpression): void;
  visit(expression: UnaryExpression): void;
  visit(expression: ValueExpression): void;
  visit(expression: MethodExpression): void;
  visit(expression: PropertyExpression): void;
  visit(expression: LambdaExpression): void;
}
