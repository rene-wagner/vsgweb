export type JsonLdContext = string | Record<string, unknown>;

export interface JsonLdResource {
  "@context"?: JsonLdContext;
  "@id"?: string;
  "@type"?: string;
}

export interface ApiCollectionView {
  "@id"?: string;
  "@type"?: string;
  first?: string;
  last?: string;
  previous?: string;
  next?: string;
}

export interface ApiCollectionSearchMapping {
  "@type"?: string;
  variable: string;
  property?: string | null;
  required?: boolean;
}

export interface ApiCollectionSearch {
  "@type"?: string;
  template?: string;
  variableRepresentation?: string;
  mapping?: ApiCollectionSearchMapping[];
}

export interface ApiCollection<TItem> extends JsonLdResource {
  member: TItem[];
  totalItems?: number;
  view?: ApiCollectionView;
  search?: ApiCollectionSearch;
}

export interface UserSummary extends JsonLdResource {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface User extends UserSummary {
  roles: string[];
}

export interface CategorySummary extends JsonLdResource {
  name: string;
  slug: string;
}

export interface Category extends CategorySummary {
  id: number;
  posts?: Post[];
}

export interface ContactPerson extends JsonLdResource {
  id: number;
  slug: string;
  firstName: string;
  lastName: string;
  position: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  picture?: string | null;
}

export interface LocationSummary extends JsonLdResource {
  id: number;
  name: string;
  street?: string | null;
  city?: string | null;
  mapsUrl?: string | null;
}

export interface Location extends LocationSummary {
  picture?: string | null;
}

export interface DepartmentStatistic extends JsonLdResource {
  id: number;
  label: string;
  value: string;
}

export interface DepartmentTrainingSession extends JsonLdResource {
  id: number;
  day: string;
  time: string;
  location?: LocationSummary | null;
}

export interface DepartmentTrainingGroup extends JsonLdResource {
  id: number;
  name: string;
  ageRange?: string | null;
  departmentTrainingSessions: DepartmentTrainingSession[];
}

export interface Department extends JsonLdResource {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  departmentStats: DepartmentStatistic[];
  trainingGroups: DepartmentTrainingGroup[];
}

export type EventRecurrence = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | null;

export interface Event extends JsonLdResource {
  id: number;
  title: string;
  description?: string | null;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  recurrence?: EventRecurrence;
  recurrenceUntil?: string | null;
  picture?: string | null;
}

export interface MediaFolder extends JsonLdResource {
  id: number;
  parent?: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem extends JsonLdResource {
  id: number;
  name: string;
  original_filename: string;
  mime_type: string;
  extension: string;
  type: string;
  size_bytes: number;
  description?: string | null;
  crop_x?: number | null;
  crop_y?: number | null;
  crop_width?: number | null;
  crop_height?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Post extends JsonLdResource {
  id: number;
  title: string;
  slug: string;
  content: string;
  published?: boolean;
  hits?: number;
  oldPost?: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: UserSummary;
  categories?: CategorySummary[];
  picture?: string | null;
}

export interface ApiConstraintViolation {
  propertyPath?: string;
  message?: string;
  code?: string;
}

export interface ApiErrorBody {
  "@context"?: JsonLdContext;
  "@type"?: string;
  title?: string;
  detail?: string;
  message?: string;
  description?: string;
  status?: number;
  violations?: ApiConstraintViolation[];
}

export type QueryPrimitive = string | number | boolean | Date | null | undefined;
export type QueryValue = QueryPrimitive | QueryPrimitive[];
export type QueryParams = Record<string, QueryValue>;

export interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  query?: QueryParams;
}

export interface VsgClientOptions {
  baseUrl: string;
  fetch?: typeof fetch;
  headers?: HeadersInit;
  credentials?: RequestCredentials;
}

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
  private readonly fetchImpl: typeof fetch;
  private readonly defaultHeaders: HeadersInit;
  private readonly credentials: RequestCredentials;

  constructor(options: VsgClientOptions) {
    this.baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl : `${options.baseUrl}/`;
    this.fetchImpl = options.fetch ?? fetch;
    this.defaultHeaders = options.headers ?? {};
    this.credentials = options.credentials ?? "include";

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
      list: (options?: RequestOptions) =>
        this.getCollection<Department>("/api/departments", options),
      get: (slug: string, options?: RequestOptions) =>
        this.get<Department>(`/api/departments/${encodeURIComponent(slug)}`, options),
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
      list: (options?: RequestOptions) =>
        this.getCollection<MediaItem>("/api/media_items", options),
      get: (id: number | string, options?: RequestOptions) =>
        this.get<MediaItem>(`/api/media_items/${encodeURIComponent(String(id))}`, options),
    };

    this.posts = {
      list: (options?: RequestOptions) => this.getCollection<Post>("/api/posts", options),
      get: (slug: string, options?: RequestOptions) =>
        this.get<Post>(`/api/posts/${encodeURIComponent(slug)}`, options),
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

  async getCollection<TItem>(
    path: string,
    options: RequestOptions = {},
  ): Promise<ApiCollection<TItem>> {
    return this.request<ApiCollection<TItem>>(path, options);
  }

  private async request<TResponse>(path: string, options: RequestOptions): Promise<TResponse> {
    const { query, headers, ...requestInit } = options;
    const url = new URL(withQuery(path, query), this.baseUrl);

    const response = await this.fetchImpl(url, {
      ...requestInit,
      method: "GET",
      credentials: this.credentials,
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
