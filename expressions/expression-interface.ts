import {ExpressionVisitor} from './expression-visitor';

export interface ExpressionInterface {
  accept(v: ExpressionVisitor): void;
}
