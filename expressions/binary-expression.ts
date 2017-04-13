import {ExpressionInterface} from './expression-interface';
import {ExpressionVisitor} from './expression-visitor';
import {ODataOperator} from '../interfaces/o-data-expression';

export class BinaryExpression implements ExpressionInterface, ODataOperator {
  public operator: string;

  constructor(private left: ExpressionInterface, private right: ExpressionInterface) {
  }

  public accept(v: ExpressionVisitor): void {
    if (this.left) {
      this.left.accept(v);
    }

    if (this.right) {
      this.right.accept(v);
    }

    v.visit(this);
  }
}
