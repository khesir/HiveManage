/* eslint-disable @typescript-eslint/no-explicit-any */
// Define the OpenAPI document types

// OpenAPI Specification
export interface OpenAPISpec {
  openapi: string;
  info: Info;
  servers: Server[];
  paths: Paths;
  components: Components;
  security: SecurityRequirement[];
  tags: Tag[];
}

// Info object
export interface Info {
  title: string;
  description: string;
  version: string;
}

// Server object
export interface Server {
  url: string;
  description: string;
}

// Paths object
export interface Paths {
  [path: string]: PathItem;
}

// PathItem object
export interface PathItem {
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  trace?: Operation;
  servers?: Server[];
  parameters?: Parameter[];
}

// Operation object
export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Responses;
  security?: SecurityRequirement[];
  servers?: Server[];
}

// Parameter object
export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema: Schema;
}

// RequestBody object
export interface RequestBody {
  description?: string;
  content: {
    [mediaType: string]: MediaType;
  };
  required?: boolean;
}

// MediaType object
export interface MediaType {
  schema: Schema;
}

// Schema object
export interface Schema {
  type?: string;
  format?: string;
  items?: Schema;
  properties?: { [key: string]: Schema };
  required?: string[];
  description?: string;
  example?: any;
}

// Responses object
export interface Responses {
  [statusCode: string]: Response;
}

// Response object
export interface Response {
  description: string;
  content?: {
    [mediaType: string]: MediaType;
  };
}

// SecurityRequirement object
export interface SecurityRequirement {
  [name: string]: string[];
}

// Components object
export interface Components {
  schemas: { [name: string]: Schema };
  securitySchemes: { [name: string]: SecurityScheme };
}

// SecurityScheme object
export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlows;
  openIdConnectUrl?: string;
}

// OAuthFlows object
export interface OAuthFlows {
  implicit?: OAuthFlow;
  password?: OAuthFlow;
  clientCredentials?: OAuthFlow;
  authorizationCode?: OAuthFlow;
}

// OAuthFlow object
export interface OAuthFlow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: { [name: string]: string };
}

// Tag object
export interface Tag {
  name: string;
  description?: string;
}
