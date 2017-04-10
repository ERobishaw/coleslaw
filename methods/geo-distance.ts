import {MethodExpression} from "../expressions/method-expression";
import {ExpressionInterface} from "../expressions/expression-interface";

export class GeoDistance extends MethodExpression {
  constructor(left: ExpressionInterface, right: ExpressionInterface) {
    super();

    this.expressions = [left, right];
  }

  public methodName: string = "geo.distance";
}
