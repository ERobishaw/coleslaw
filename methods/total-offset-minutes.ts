import {MethodExpression} from '../expressions/method-expression';
import {ExpressionInterface} from '../expressions/expression-interface';

export class TotalOffsetMinutes extends MethodExpression {
  constructor(ex: ExpressionInterface) {
    super();

    this.expressions = [ex];
  }

  public methodName: string = 'totaloffsetminutes';
}
