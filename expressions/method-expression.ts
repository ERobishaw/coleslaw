import {ExpressionInterface} from './expression-interface';
import {ExpressionVisitor} from './expression-visitor';

export class MethodExpression implements ExpressionInterface {
  public methodName: string;
  public expressions: ExpressionInterface[] = [];

  public accept(v: ExpressionVisitor): void {
    for (let ex of this.expressions) {
      ex.accept(v);
    }

    v.visit(this);
  }
}
