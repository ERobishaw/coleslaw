import {ExpressionInterface} from './expression-interface';
import {ExpressionVisitor} from './expression-visitor';

export class ValueExpression implements ExpressionInterface {
  constructor(private item: any) {
  }

  public value(): any {
    return this.item;
  };

  public accept(v: ExpressionVisitor): void {
    v.visit(this);
  }
}
