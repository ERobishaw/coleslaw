import {ExpressionInterface} from "./expression-interface";
import {ExpressionVisitor} from "./expression-visitor";

export class LambdaExpression implements ExpressionInterface {
  public methodName: string;

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
