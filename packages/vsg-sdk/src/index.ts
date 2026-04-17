import type { ApiErrorBody } from "./types/api-error.types.js";
import type { QueryParams, QueryValue, RequestOptions, VsgClientOptions } from "./types/client.types.js";
import type { ApiCollection } from "./types/api-collection.types.js";
import type { Category } from "./types/category.types.js";
import type { ContactPerson } from "./types/contact-person.types.js";
import type { Event } from "./types/event.types.js";
import type { Location } from "./types/location.types.js";
import type { MediaFolder, MediaItem } from "./types/media.types.js";
import type { User } from "./types/user.types.js";
import type { ApiDepartment, ApiPost } from "@vsg/types";

export type * from "./types/index.js";

export class VsgApiError<TBody = unknown> extends Error {
  readonly status: number;
  readonly response: Response;
  readonly body: TBody | string | undefined;

  constructor(message: string, response: Response, body?: TBody | string) {
    super(message);
    this.name = "VsgApiError";
    this.status = response.status;
    this.response = response;
    this.body = body;
  }
}

function appendQueryValue(searchParams: URLSearchParams, key: string, value: QueryValue): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      appendQueryValue(searchParams, key, item);
    }

    return;
  }

  if (value === null || value === undefined) {
    return;
  }

  searchParams.append(key, value instanceof Date ? value.toISOString() : String(value));
}

function withQuery(path: string, query?: QueryParams): string {
  if (!query) {
    return path;
  }

  const [pathname = path, existingQuery = ""] = path.split("?", 2);
  const searchParams = new URLSearchParams(existingQuery);

  for (const [key, value] of Object.entries(query)) {
    appendQueryValue(searchParams, key, value);
  }

  const serializedQuery = searchParams.toString();
  return serializedQuery ? `${pathname}?${serializedQuery}` : pathname;
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJsonResponse = contentType.includes("json") || contentType.includes("+json");

  if (isJsonResponse) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

function getErrorMessage(body: unknown, response: Response): string {
  if (typeof body === "string" && body.length > 0) {
    return body;
  }

  if (body && typeof body === "object") {
    const apiBody = body as ApiErrorBody;
    return (
      apiBody.detail ??
      apiBody.message ??
      apiBody.description ??
      apiBody.title ??
      `${response.status} ${response.statusText}`
    );
  }

  return `${response.status} ${response.statusText}`;
}

export class VsgClient {
  readonly categories;
  readonly contactPeople;
  readonly departments;
  readonly events;
  readonly locations;
  readonly mediaFolders;
  readonly mediaItems;
  readonly posts;
  readonly users;

  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  constructor(options: VsgClientOptions) {
    this.baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl : `${options.baseUrl}/`;
    this.defaultHeaders = options.headers ?? {};

    this.categories = {
      list: (options?: RequestOptions) => this.getCollection<Category>("/api/categories", options),
      get: (slug: string, options?: RequestOptions) =>
        this.get<Category>(`/api/categories/${encodeURIComponent(slug)}`, options),
    };

    this.contactPeople = {
      list: (options?: RequestOptions) =>
        this.getCollection<ContactPerson>("/api/contact_people", options),
      get: (slug: string, options?: RequestOptions) =>
        this.get<ContactPerson>(`/api/contact_people/${encodeURIComponent(slug)}`, options),
    };

    this.departments = {
      list: (options?: RequestOptions) => this.getCollection<ApiDepartment>("/api/departments", options),
      get: (slug: string, options?: RequestOptions) =>
        this.get<ApiDepartment>(`/api/departments/${encodeURIComponent(slug)}`, options),
    };

    this.events = {
      list: (options?: RequestOptions) => this.getCollection<Event>("/api/events", options),
      get: (id: number | string, options?: RequestOptions) =>
        this.get<Event>(`/api/events/${encodeURIComponent(String(id))}`, options),
    };

    this.locations = {
      list: (options?: RequestOptions) => this.getCollection<Location>("/api/locations", options),
      get: (id: number | string, options?: RequestOptions) =>
        this.get<Location>(`/api/locations/${encodeURIComponent(String(id))}`, options),
    };

    this.mediaFolders = {
      list: (options?: RequestOptions) =>
        this.getCollection<MediaFolder>("/api/media_folders", options),
      get: (id: number | string, options?: RequestOptions) =>
        this.get<MediaFolder>(`/api/media_folders/${encodeURIComponent(String(id))}`, options),
    };

    this.mediaItems = {
      list: (options?: RequestOptions) => this.getCollection<MediaItem>("/api/media_items", options),
      get: (id: number | string, options?: RequestOptions) =>
        this.get<MediaItem>(`/api/media_items/${encodeURIComponent(String(id))}`, options),
    };

    this.posts = {
      list: (options?: RequestOptions) => this.getCollection<ApiPost>("/api/posts", options),
      get: (slug: string, options?: RequestOptions) =>
        this.get<ApiPost>(`/api/posts/${encodeURIComponent(slug)}`, options),
    };

    this.users = {
      list: (options?: RequestOptions) => this.getCollection<User>("/api/users", options),
      get: (id: number | string, options?: RequestOptions) =>
        this.get<User>(`/api/users/${encodeURIComponent(String(id))}`, options),
    };
  }

  async get<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
    return this.request<TResponse>(path, options);
  }

  async getCollection<TItem>(path: string, options: RequestOptions = {}): Promise<ApiCollection<TItem>> {
    return this.request<ApiCollection<TItem>>(path, options);
  }

  private async request<TResponse>(path: string, options: RequestOptions): Promise<TResponse> {
    const { query, headers, ...requestInit } = options;
    const url = new URL(withQuery(path, query), this.baseUrl);

    const response = await fetch(url, {
      ...requestInit,
      method: "GET",
      headers: {
        Accept: "application/ld+json, application/json",
        ...this.defaultHeaders,
        ...headers,
      },
    });

    const body = await readResponseBody(response);

    if (!response.ok) {
      throw new VsgApiError(getErrorMessage(body, response), response, body);
    }

    return body as TResponse;
  }
}

export function createVsgClient(options: VsgClientOptions): VsgClient {
  return new VsgClient(options);
}
