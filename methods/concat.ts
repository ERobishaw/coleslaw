import {MethodExpression} from "../expressions/method-expression";
import {ExpressionInterface} from "../expressions/expression-interface";

export class Concat extends MethodExpression {
  constructor(left: ExpressionInterface, right: ExpressionInterface) {
    super();

    this.expressions = [left, right];
  }

  public methodName: string = "concat";
}
