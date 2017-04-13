import {MethodExpression} from '../expressions/method-expression';
import {ExpressionInterface} from '../expressions/expression-interface';

export class StartsWith extends MethodExpression {
  constructor(left: ExpressionInterface, right: ExpressionInterface) {
    super();

    this.expressions = [left, right];
  }

  public methodName: string = 'startswith';
}
