import {PropertyExpression} from '../expressions/property-expression';
import {MethodExpression} from "../expressions/method-expression";
import {SortDirection} from "./sort-direction";

export class OrderBy extends MethodExpression {
    constructor(ex: PropertyExpression, public sortDirection: SortDirection) {
        super();

        this.expressions = [ex];
    }

    public methodName: string = 'orderBy';
}