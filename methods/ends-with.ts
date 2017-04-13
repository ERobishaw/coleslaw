import {MethodExpression} from '../expressions/method-expression';
import {ExpressionInterface} from '../expressions/expression-interface';

export class EndsWith extends MethodExpression {
  constructor(left: ExpressionInterface, right: ExpressionInterface) {
    super();

    this.expressions = [left, right];
  }

  public methodName: string = 'endswith';
}
