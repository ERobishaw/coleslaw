import {PropertyExpression} from '../expressions/property-expression';
import {SortDirection} from './sort-direction';

export class OrderBy {
    constructor(public property: PropertyExpression, public sortDirection: SortDirection) {
    }
}