import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const routesPath = path.join(
  process.cwd(),
  "src/modules/**/*.routes.ts"
);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Booth Command API",
      version: "3.1.1",
      description:
        "REST API for Booth Command management system",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Auth",
        description: "Admin authentication",
      },
      {
        name: "Voters",
        description: "Admin voter management",
      },
      {
        name: "Volunteer Voters",
        description:
          "Voter APIs restricted to volunteer's assigned booth",
      },
      {
        name: "Volunteers",
        description: "Volunteer management",
      },
      {
        name: "Volunteer Auth",
        description: "Volunteer authentication",
      },
      {
        name: "Booths",
        description: "Booth management",
      },
    ],

    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Something went wrong",
            },
          },
        },

        Voter: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },

            epic: {
              type: "string",
              example: "ABC1234567",
            },

            name: {
              type: "string",
              example: "Raj Kumar",
            },

            nameHindi: {
              type: "string",
              nullable: true,
            },

            fatherName: {
              type: "string",
              nullable: true,
            },

            fatherNameHindi: {
              type: "string",
              nullable: true,
            },

            motherName: {
              type: "string",
              nullable: true,
            },

            husbandName: {
              type: "string",
              nullable: true,
            },

            gender: {
              type: "string",
              nullable: true,
            },

            age: {
              type: "integer",
              nullable: true,
            },

            dateOfBirth: {
              type: "string",
              nullable: true,
            },

            houseNumber: {
              type: "string",
              nullable: true,
            },

            village: {
              type: "string",
              nullable: true,
            },

            assemblyNumber: {
              type: "string",
              nullable: true,
            },

            partNumber: {
              type: "string",
              nullable: true,
            },

            partSerial: {
              type: "string",
              nullable: true,
            },

            pollingStationName: {
              type: "string",
              nullable: true,
            },

            mobile: {
              type: "string",
              nullable: true,
            },

            verification: {
              type: "string",
              enum: [
                "VERIFIED",
                "UNVERIFIED",
              ],
            },

            classification: {
              type: "string",
              nullable: true,
              enum: [
                "GREEN",
                "YELLOW",
                "RED",
                "BLACK",
              ],
            },

            voteStatus: {
              type: "string",
              enum: [
                "PENDING",
                "DONE",
              ],
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 20,
            },
            total: {
              type: "integer",
              example: 100,
            },
            totalPages: {
              type: "integer",
              example: 5,
            },
          },
        },
      },
    },
  },

  // IMPORTANT
  // Use absolute path so swagger-jsdoc
  // can find route files.
  apis: [routesPath],

  failOnErrors: true,
};

export const swaggerSpec =
  swaggerJSDoc(options);