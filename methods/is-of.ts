import {MethodExpression} from "../expressions/method-expression";
import {ExpressionInterface} from "../expressions/expression-interface";

export class IsOf extends MethodExpression {
  constructor(left: ExpressionInterface)
  constructor(left: ExpressionInterface, right?: ExpressionInterface) {
    super();

    this.expressions = [left];

    if (right) {
      this.expressions.push(right);
    }
  }

  public methodName: string = "isof";
}
