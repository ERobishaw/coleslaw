import {Http, Response} from "@angular/http";

import {Observable} from "rxjs";

import {Expression} from "./expression";
import {ExpressionInterface} from "./expressions/expression-interface";
import {ODataVisitor} from "./odata-visitor";
import {And} from "./filters/and";
import {ODataSettings} from "./interfaces/o-data-settings";
import {OrderBy} from "./operators/order-by";
import {SortDirection} from "./operators/sort-direction";

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
    private oDataString: string;

    constructor(private http: Http, private url: string) {
    }

    public any<TValue>(param: (type: T) => any[], ex: ExpressionInterface): RequestBuilder<T> {
        this.$filters.push(Expression.any(param, ex));
        return this;
    }

    public filter(value: ExpressionInterface): RequestBuilder<T> {
        this.$filters.push(value);
        return this;
    }

    public equals<TValue>(param: (type: T) => TValue, value: ExpressionInterface): RequestBuilder<T>
    public equals<TValue>(param: (type: T) => TValue, value: TValue): RequestBuilder<T>
    public equals<TValue>(param: (type: T) => TValue, value: any): RequestBuilder<T> {
        this.$filters.push(Expression.equals(param, value));
        return this;
    }

    public contains<TValue>(param: (type: T) => TValue, value: ExpressionInterface): RequestBuilder<T>
    public contains<TValue>(param: (type: T) => TValue, value: TValue): RequestBuilder<T> {
        this.$filters.push(Expression.contains(param, value));
        return this;
    }

    public lt<TValue>(param: (type: T) => TValue, value: any): RequestBuilder<T> {
        this.$filters.push(Expression.lt(param, value));
        return this;
    }

    public lte<TValue>(param: (type: T) => TValue, value: any): RequestBuilder<T> {
        this.$filters.push(Expression.lte(param, value));
        return this;
    }

    public gt<TValue>(param: (type: T) => TValue, value: any): RequestBuilder<T> {
        this.$filters.push(Expression.gt(param, value));
        return this;
    }

    public gte<TValue>(param: (type: T) => TValue, value: any): RequestBuilder<T> {
        this.$filters.push(Expression.gte(param, value));
        return this;
    }

    public multiply(left: number, right: number): RequestBuilder<T> {
        this.$filters.push(Expression.multiply(left, right));
        return this;
    }

    public top(limit: number): RequestBuilder<T> {
        this.$top = Expression.top(limit);
        return this;
    }

    public skip(num: number): RequestBuilder<T> {
        this.$skip = Expression.skip(num);
        return this;
    }

    public inlineCount(): RequestBuilder<T> {
        this.$inlineCount = "allpages";
        return this;
    }

    public orderByBuilder(...orderBys: OrderBy[]): RequestBuilder<T> {
        let orderByStatement: Array<string> = [];

        orderBys.forEach(orderBy => {
            orderByStatement.push(`${this.expressionToString(orderBy.property)} ${SortDirection[orderBy.sortDirection]}`);
        });

        this.$orderBy = orderByStatement.join();
        return this;
    }

    public orderBy<TValue>(...params: ((type: T) => TValue)[]): RequestBuilder<T> {
        this.$orderBy = this.propertiesToStrings(...params).join();
        return this;
    }

    public orderByDescending<TValue>(...params: ((type: T) => TValue)[]): RequestBuilder<T> {
        this.$orderBy = `${this.propertiesToStrings(...params).join()} desc`;
        return this;
    }

    public select<TValue>(...params: ((type: T) => TValue)[]): RequestBuilder<T> {
        this.$select = this.propertiesToStrings(...params).join();
        return this;
    }

    public search(value: string): RequestBuilder<T> {
        this.$search = value;
        return this;
    }

    /** Creates the expand statement.  Can only be used once per request. **/
    public expand<TValue>(param: (type: T) => TValue): RequestBuilder<T> {
        this.$expand = Expression.subNameOf(param, "$expand");

        return this;
    }

    public count(): RequestBuilder<T> {
        this.$count = "true";
        return this;
    }

    /** Adds an OData string created outside of the builder.  This would be used to integrate with a third party or create an OData query that is not currently supported. **/
    public addODataString(oDataString: string): void {
        this.oDataString = oDataString;
    }

    public get(): Observable<Response> {
        let oDataSettings = this.createODataSettings();
        let params = this.oDataString || this.createString(oDataSettings);

        return this.http.get(`${this.url}?${params}`);
    }

    public post(data: any): Observable<Response> {
        let oDataSettings = this.createODataSettings();
        let params = this.oDataString || this.createString(oDataSettings);

        return this.http.post(`${this.url}?${params}`, data);
    }

    public put(data: any): Observable<Response> {
        let oDataSettings = this.createODataSettings();
        let params = this.oDataString || this.createString(oDataSettings);

        return this.http.put(`${this.url}?${params}`, data);
    }

    public patch(data: any): Observable<Response> {
        let oDataSettings = this.createODataSettings();
        let params = this.oDataString || this.createString(oDataSettings);

        return this.http.patch(`${this.url}?${params}`, data);
    }

    public delete(): Observable<Response> {
        let oDataSettings = this.createODataSettings();
        let params = this.oDataString || this.createString(oDataSettings);

        return this.http.delete(`${this.url}?${params}`);
    }

    private createODataSettings(): ODataSettings {
        let expression: ExpressionInterface;

        for (let filter of this.$filters) {
            expression = expression ? new And(expression, filter) : filter;
        }

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

    private createString(query: ODataSettings): string {
        return Object.keys(query)
            .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
            .join("&")
            .replace(/%20/g, "+");
    }

    private propertiesToStrings<TValue>(...params: ((type: T) => TValue)[]): string[] {
        let temp: string[] = [];

        for (let param of params) {
            temp.push(Expression.nameof(param));
        }

        return temp;
    }

    private expressionToString(expression: ExpressionInterface) {
        let visitor = new ODataVisitor();

        expression.accept(visitor);
        return visitor.result();
    }
}
