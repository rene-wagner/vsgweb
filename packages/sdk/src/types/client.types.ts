export type QueryPrimitive = string | number | boolean | Date | null | undefined;
export type QueryValue = QueryPrimitive | QueryPrimitive[];
export type QueryParams = Record<string, QueryValue>;

export interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  query?: QueryParams;
}

export interface VsgClientOptions {
  baseUrl: string;
  headers?: HeadersInit;
}
