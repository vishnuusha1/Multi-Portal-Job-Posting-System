module.exports = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description:
      "This is a sample API documentation generated with Swagger in JavaScript",
  },
  servers: [
    {
      url: "http://localhost:9000/api",
    },
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your Bearer token in the format `Bearer <token>`",
      },
    },

    security: [
      {
        BearerAuth: [],
      },
    ],
    schemas: {
      Portal: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of the portal",
          },
          description: {
            type: "string",
            description: "Description of the portal",
          },
          status: {
            type: "string",
            enum: ["active", "inactive", "suspended"],
            description: "Status of the portal",
          },
          logo: {
            type: "string",
            format: "binary",
            description: "Logo of the portal (file upload)",
          },
        },
      },
      Job: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "Unique identifier for the job",
          },
          title: {
            type: "string",
            description: "Title of the job",
          },
          description: {
            type: "string",
            description: "Description of the job",
          },
          status: {
            type: "string",
            enum: ["open", "closed", "expired"],
            description: "Status of the job",
          },
        },
        required: ["id", "title", "description", "status", "file"],
      },
      JobInput: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Title of the job",
          },
          description: {
            type: "string",
            description: "Description of the job",
          },
          status: {
            type: "string",
            enum: ["open", "closed", "expired"],
            description: "Status of the job",
          },
          portalId: {
            type: "string",
            default: "2a06370f-6e34-443c-97a7-d8a20aee8316",
          },
        },
        required: ["title", "description", "status", "file", "portalId"],
      },"DocumentResponse": {
        "type": "object",
        "properties": {
          "docId": {
            "type": "string",
            "format": "uuid",
            "description": "Unique identifier for the document"
          },
          "fileName": {
            "type": "string",
            "description": "Name of the uploaded file"
          },
          "filePath": {
            "type": "string",
            "description": "Path to the uploaded file"
          },
          "fileType": {
            "type": "string",
            "description": "Type of the uploaded file (e.g., pdf, docx)"
          },
          "jobId": {
            "type": "string",
            "format": "uuid",
            "description": "Unique identifier for the job"
          },
          "portalId": {
            "type": "string",
            "format": "uuid",
            "description": "Unique identifier for the portal"
          },
          "fileSize": {
            "type": "integer",
            "description": "Size of the uploaded file in bytes"
          },
          "deletedAt": {
            "type": "string",
            "format": "date-time",
            "nullable": true,
            "description": "Timestamp when the document was deleted, if applicable"
          }
        },
        "example": {
          "docId": "a3fcb98e-1e62-4c2f-b5ab-3d1d3f7c6b20",
          "fileName": "resume.pdf",
          "filePath": "/uploads/documents/resume.pdf",
          "fileType": "pdf",
          "jobId": "123e4567-e89b-12d3-a456-426614174000",
          "portalId": "789e1234-b56d-89c0-a123-456789abcdef",
          "fileSize": 204800,
          "deletedAt": null
        }
      }
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["auth"], // Tagging this endpoint with 'cats'
        description: "Logs in using the username and password",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    default: "admin",
                  },
                  password: {
                    type: "string",
                    default: "admin123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successfully logged in",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },

    "/portal": {
      post: {
        tags: ["Portal"],
        summary: "Create a new portal with details and logo",
        operationId: "createPortal",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the portal",
                  },
                  description: {
                    type: "string",
                    description: "Description of the portal",
                  },
                  status: {
                    type: "string",
                    enum: ["active", "inactive", "suspended"],
                    description: "Status of the portal",
                  },
                  logo: {
                    type: "string",
                    format: "binary",
                    description: "Logo image file",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Portal created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    portal: { $ref: "#/components/schemas/Portal" },
                  },
                },
              },
            },
          },
          500: {
            description: "Failed to create portal",
          },
        },
      },
      get: {
        tags: ["Portal"],
        summary: "Get all portals with optional filters and pagination",
        operationId: "getPortals",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            description: "Search term to filter portal name or description",
            schema: {
              type: "string",
            },
          },
          {
            name: "field",
            in: "query",
            required: false,
            description: 'Field to sort by (e.g., "name", "status")',
            schema: {
              type: "string",
            },
          },
          {
            name: "order",
            in: "query",
            required: false,
            description: 'Order of sorting ("asc" or "desc")',
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Page number for pagination",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            name: "pageSize",
            in: "query",
            required: false,
            description: "Number of items per page",
            schema: {
              type: "integer",
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "List of portals with applied filters",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Portal",
                      },
                    },
                    total: {
                      type: "integer",
                      description: "Total number of portals available",
                    },
                    page: {
                      type: "integer",
                      description: "Current page number",
                    },
                    pageSize: {
                      type: "integer",
                      description: "Number of items per page",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/portal/{id}": {
      get: {
        tags: ["Portal"],
        summary: "Get a portal by ID",
        operationId: "getPortalById",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Portal ID",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "A single portal",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Portal",
                },
              },
            },
          },
          404: {
            description: "Portal not found",
          },
        },
      },
      delete: {
        tags: ["Portal"],
        summary: "Delete a portal by ID",
        operationId: "deletePortalsss",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Portal ID",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Portal deleted successfully",
          },
          404: {
            description: "Portal not found",
          },
          500: {
            description: "Failed to delete portal",
          },
        },
      },
      put: {
        tags: ["Portal"],
        summary: "Update a portal by ID",
        operationId: "updatePortal",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Portal ID",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Updated name of the portal",
                  },
                  description: {
                    type: "string",
                    description: "Updated description of the portal",
                  },
                  status: {
                    type: "string",
                    enum: ["active", "inactive", "suspended"],
                    description: "Updated status of the portal",
                  },
                  logo: {
                    type: "string",
                    format: "binary",
                    description: "Updated logo image file (optional)",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Portal updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Portal",
                },
              },
            },
          },
          400: {
            description: "Invalid data provided",
          },
          404: {
            description: "Portal not found",
          },
          500: {
            description: "Failed to update portal",
          },
        },
      },
      delete: {
        tags: ["Portal"],
        summary: "Delete a portal",
        operationId: "deletePortal",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the portal to delete",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          204: {
            description: "Portal deleted successfully",
          },
          404: {
            description: "Portal not found",
          },
        },
      },
    },

    "/api/jobs/{id}/documents/{portalId}": {
      "post": {
        "tags": ["Job Documents"],
        "summary": "Upload a document to a job for a specific portal",
        "operationId": "uploadJobDocument",
        "security": [
          {
            "BearerAuth": []
          }
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "The ID of the job to which the document is being uploaded",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "portalId",
            "in": "path",
            "required": true,
            "description": "The portal ID where the document will be uploaded",
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "file": {
                    "type": "string",
                    "format": "binary",
                    "description": "The document file to be uploaded"
                  }
                },
                "required": ["file"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Document uploaded successfully",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DocumentResponse"
                }
              }
            }
          },
          "400": {
            "description": "Invalid request data"
          },
          "401": {
            "description": "Unauthorized - Invalid or missing token"
          },
          "404": {
            "description": "Job or portal not found"
          }
        }
      }
    },
    "/jobs": {
      get: {
        tags: ["Jobs"],
        summary: "Get all jobs",
        operationId: "getJobs",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            description: "Search term to filter portal name or description",
            schema: {
              type: "string",
            },
          },
          {
            name: "field",
            in: "query",
            required: false,
            description: 'Field to sort by (e.g., "name", "status")',
            schema: {
              type: "string",
            },
          },
          {
            name: "order",
            in: "query",
            required: false,
            description: 'Order of sorting ("asc" or "desc")',
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            description: "Page number for pagination",
            schema: {
              type: "integer",
              default: 1,
            },
          },
          {
            name: "pageSize",
            in: "query",
            required: false,
            description: "Number of items per page",
            schema: {
              type: "integer",
              default: 10,
            },
          },
        ],
        responses: {
          200: {
            description: "List of jobs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Job",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Jobs"],
        summary: "Create a new job",
        operationId: "createJob",
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/JobInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Job created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Job",
                },
              },
            },
          },
        },
      },
    },
    "/jobs/{id}": {
      put: {
        tags: ["Jobs"],
        summary: "Update a job",
        operationId: "updateJob",
        security: [
          {
            BearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the job to update",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/JobInput",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Job updated successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Job",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Jobs"],
        summary: "Delete a job",
        security: [
          {
            BearerAuth: [],
          },
        ],
        operationId: "deleteJob",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID of the job to delete",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          204: {
            description: "Job deleted successfully",
          },
          404: {
            description: "Job not found",
          },
        },
      },
    },

    "/jobad-summary/{timeframe}": {
      get: {
        tags: ["Job Ad Summary"],
        security: [
          {
            BearerAuth: [],
          },
        ],
        summary: "Get job ad summary for a timeframe",
        operationId: "getJobAdSummary",
        parameters: [
          {
            name: "timeframe",
            in: "path",
            required: true,
            description:
              "The timeframe for the summary (e.g., 'year', 'month', 'week')",
            schema: {
              type: "string",
              enum: ["day", "week", "month"],
            },
          },
        ],
        responses: {
          200: {
            description: "Job ad summary for the specified timeframe",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    timeframe: {
                      type: "string",
                      description: "The timeframe used for the summary",
                    },
                    period_start: {
                      type: "string",
                      format: "date",
                      description: "The start date of the period",
                    },
                    period_end: {
                      type: "string",
                      format: "date",
                      description: "The end date of the period",
                    },
                    summary: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          total_jobs: {
                            type: "integer",
                            description: "Total number of jobs",
                          },
                          active_jobs: {
                            type: "integer",
                            description: "Number of active jobs",
                          },
                          closed_jobs: {
                            type: "integer",
                            description: "Number of closed jobs",
                          },
                        },
                      },
                      description: "An array containing summary data",
                    },
                  },
                  example: {
                    timeframe: "month",
                    period_start: "2025-01-01",
                    period_end: "2025-01-31",
                    summary: [
                      {
                        total_jobs: 2,
                        active_jobs: 0,
                        closed_jobs: 0,
                      },
                    ],
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid input parameters",
          },
          404: {
            description: "No data found for the specified timeframe",
          },
        },
      },
    },
    "/portal-usage-summary": {
      get: {
        tags: ["Portal Usage Summary"],
        summary: "Get portal usage summary data",
        operationId: "getPortalUsageSummary",
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Portal usage summary data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Status message",
                    },
                    data: {
                      type: "object",
                      properties: {
                        activePortals: {
                          type: "integer",
                          description: "Number of active portals",
                        },
                        inactivePortals: {
                          type: "integer",
                          description: "Number of inactive portals",
                        },
                        suspendedPortals: {
                          type: "integer",
                          description: "Number of suspended portals",
                        },
                        portalsWithUsage: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              portalId: {
                                type: "string",
                                description: "Unique identifier for the portal",
                              },
                              name: {
                                type: "string",
                                description: "Portal name",
                              },
                              jobsPosted: {
                                type: "integer",
                                description:
                                  "Number of jobs posted on the portal",
                              },
                              documentsUploaded: {
                                type: "integer",
                                description:
                                  "Number of documents uploaded to the portal",
                              },
                            },
                          },
                          description: "List of portals with usage data",
                        },
                      },
                    },
                  },
                  example: {
                    message: "OK",
                    data: {
                      activePortals: 5,
                      inactivePortals: 1,
                      suspendedPortals: 0,
                      portalsWithUsage: [
                        {
                          portalId: "258e2bd6-e0c9-4cf0-8801-7d5092bc3b02",
                          name: "portal4",
                          jobsPosted: 2,
                          documentsUploaded: 0,
                        },
                        {
                          portalId: "2a06370f-6e34-443c-97a7-d8a20aee8316",
                          name: "glassdoor",
                          jobsPosted: 0,
                          documentsUploaded: 0,
                        },
                        {
                          portalId: "2af98b96-c532-4255-b74a-f45bfa8e2ab5",
                          name: "Job Portal3",
                          jobsPosted: 0,
                          documentsUploaded: 0,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized - Invalid or missing token",
          },
        },
      },
    },
  },
};
