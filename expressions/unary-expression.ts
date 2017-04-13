import {ExpressionInterface} from './expression-interface';
import {ExpressionVisitor} from './expression-visitor';
import {ODataOperator} from '../interfaces/o-data-expression';

export class UnaryExpression implements ExpressionInterface, ODataOperator {
  public operator: string = '';

  constructor(private left: ExpressionInterface) {
  }

  public accept(v: ExpressionVisitor): void {
    this.left.accept(v);
    v.visit(this);
  }
}
