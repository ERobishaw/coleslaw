import {Expression} from './expression';
import {ExpressionInterface} from './expressions/expression-interface';
import {ODataVisitor} from './odata-visitor';
import {And} from './filters/and';
import {ODataSettings} from './interfaces/o-data-settings';
import {OrderBy} from './operators/order-by';
import {SortDirection} from './operators/sort-direction';

export class RequestBuilder<T> {
    private $filters: ExpressionInterface[] = [];
    private $top: ExpressionInterface;
    private $skip: ExpressionInterface;
    private $orderBy: string;
    private $inlineCount: string;
    private $select: string;
    private $expand: string;
    private $count: string;
    private $search: string;
    protected oDataString: string;

    public any<TValue>(param: (type: T) => any[], ex: ExpressionInterface): this {
        this.$filters.push(Expression.any(param, ex));
        return this;
    }

    public filter(value: ExpressionInterface): this {
        this.$filters.push(value);
        return this;
    }

    public equals<TValue>(param: (type: T) => TValue, value: ExpressionInterface): this
    public equals<TValue>(param: (type: T) => TValue, value: TValue): this
    public equals<TValue>(param: (type: T) => TValue, value: any): this {
        this.$filters.push(Expression.equals(param, value));
        return this;
    }

    public contains<TValue>(param: (type: T) => TValue, value: ExpressionInterface): this
    public contains<TValue>(param: (type: T) => TValue, value: TValue): this {
        this.$filters.push(Expression.contains(param, value));
        return this;
    }

    public lt<TValue>(param: (type: T) => TValue, value: any): this {
        this.$filters.push(Expression.lt(param, value));
        return this;
    }

    public lte<TValue>(param: (type: T) => TValue, value: any): this {
        this.$filters.push(Expression.lte(param, value));
        return this;
    }

    public gt<TValue>(param: (type: T) => TValue, value: any): this {
        this.$filters.push(Expression.gt(param, value));
        return this;
    }

    public gte<TValue>(param: (type: T) => TValue, value: any): this {
        this.$filters.push(Expression.gte(param, value));
        return this;
    }

    public multiply(left: number, right: number): this {
        this.$filters.push(Expression.multiply(left, right));
        return this;
    }

    public top(limit: number): this {
        this.$top = Expression.top(limit);
        return this;
    }

    public skip(num: number): this {
        this.$skip = Expression.skip(num);
        return this;
    }

    public inlineCount(): this {
        this.$inlineCount = 'allpages';
        return this;
    }

    public orderBy<TValue>(...params: ((type: T) => TValue)[]): this {
        this.$orderBy = this.propertiesToStrings(...params).join();
        return this;
    }

    public orderByBuilder(orderBys: OrderBy[]): this {
        let orderBy: Array<string> = [];

        orderBys.forEach(t => {
            let desc = '';

            if (t.sortDirection === SortDirection.Desc) desc = ' desc';

            orderBy.push(`${this.expressionToString(t)}${desc}`);
        });

        this.$orderBy = 'orderBy ' + orderBy.join();

        return this;
    }

    public orderByDescending<TValue>(...params: ((type: T) => TValue)[]): this {
        this.$orderBy = `${this.propertiesToStrings(...params).join()} desc`;
        return this;
    }

    public select<TValue>(...params: ((type: T) => TValue)[]): this {
        this.$select = this.propertiesToStrings(...params).join();
        return this;
    }

    public search(value: string): this {
        this.$search = value;
        return this;
    }

    /** Creates the expand statement.  Can only be used once per request. **/
    public expand<TValue>(param: (type: T) => TValue): this {
        this.$expand = Expression.subNameOf(param, '$expand');

        return this;
    }

    public count(): this {
        this.$count = 'true';
        return this;
    }

    /** Adds an OData string created outside of the builder.  This would be used to integrate with a third party or create an OData query that is not currently supported. **/
    public addODataString(oDataString: string): void {
        this.oDataString = oDataString;
    }

    protected createODataSettings(): ODataSettings {
        let expression: ExpressionInterface;

        this.$filters.forEach(filter => {
            expression = expression ? new And(expression, filter) : filter;
        });

        let oDataSettings: ODataSettings = {};

        if (this.$search) {
            oDataSettings.$search = this.$search;
        }

        if (this.$filters && this.$filters.length) {
            oDataSettings.$filter = this.expressionToString(expression);
        }

        if (this.$select) {
            oDataSettings.$select = this.$select;
        }

        if (this.$top) {
            oDataSettings.$top = this.expressionToString(this.$top);
        }

        if (this.$skip) {
            oDataSettings.$skip = this.expressionToString(this.$skip);
        }

        if (this.$inlineCount) {
            oDataSettings.$inlinecount = this.$inlineCount;
        }

        if (this.$orderBy) {
            oDataSettings.$orderby = this.$orderBy;
        }

        if (this.$expand) {
            oDataSettings.$expand = this.$expand;
        }

        if (this.$count) {
            oDataSettings.$count = this.$count;
        }

        return oDataSettings;
    }

    protected createString(query: ODataSettings): string {
        return Object.keys(query)
            .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
            .join('&')
            .replace(/%20/g, '+');
    }

    protected propertiesToStrings<TValue>(...params: ((type: T) => TValue)[]): string[] {
        let temp: string[] = [];

        for (let param of params) {
            temp.push(Expression.nameof(param));
        }

        return temp;
    }

    protected expressionToString(expression: ExpressionInterface): string {
        let visitor = new ODataVisitor();

        expression.accept(visitor);
        return visitor.result();
    }
}
