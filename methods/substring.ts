import {MethodExpression} from '../expressions/method-expression';
import {ExpressionInterface} from '../expressions/expression-interface';

export class Substring extends MethodExpression {
  constructor(left: ExpressionInterface, right: ExpressionInterface)
  constructor(left: ExpressionInterface, right: ExpressionInterface, length?: ExpressionInterface) {
    super();

    this.expressions = [left, right];
    if (length) {
      this.expressions.push(length);
    }
  }

  public methodName: string = 'substring';
}
