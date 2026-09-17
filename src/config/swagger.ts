import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

const apiFiles = [
  path.resolve(process.cwd(), "src/app.ts"),
  path.resolve(process.cwd(), "src/modules/auth/auth.routes.ts"),
  path.resolve(process.cwd(), "src/modules/users/users.routes.ts"),
  path.resolve(process.cwd(), "src/modules/assembly/assembly.routes.ts"),
  path.resolve(process.cwd(), "src/modules/booths/booths.routes.ts"),
  path.resolve(process.cwd(), "src/modules/volunteer/volunteer.routes.ts"),
  path.resolve(process.cwd(), "src/modules/volunteer-auth/volunteer-auth.routes.ts"),
  path.resolve(process.cwd(), "src/modules/voters/voters.routes.ts"),
  path.resolve(process.cwd(), "src/modules/volunteer-voters/volunteer-voters.routes.ts"),
];

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
        name: "Health",
        description: "System health check",
      },
      {
        name: "Auth",
        description: "Admin authentication",
      },
      {
        name: "Users",
        description: "Admin user management",
      },
      {
        name: "Assemblies",
        description: "Assembly constituency management",
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

        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              example: "Admin User",
            },
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            role: {
              type: "string",
              enum: ["ADMIN"],
              example: "ADMIN",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE"],
              example: "ACTIVE",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Assembly: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            number: {
              type: "string",
              example: "123",
            },
            name: {
              type: "string",
              example: "Model Town",
            },
            district: {
              type: "string",
              example: "North Delhi",
            },
            electionYear: {
              type: "integer",
              example: 2025,
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Booth: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            boothNumber: {
              type: "string",
              example: "12A",
            },
            name: {
              type: "string",
              example: "Booth 12A",
            },
            village: {
              type: "string",
              nullable: true,
              example: "Shahdara",
            },
            assemblyId: {
              type: "string",
              format: "uuid",
            },
            volunteerId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            status: {
              type: "string",
              enum: ["NOT_STARTED", "VOTING_STARTED", "PROBLEM"],
              example: "NOT_STARTED",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Volunteer: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
              example: "Rajesh Kumar",
            },
            mobile: {
              type: "string",
              example: "9876543210",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE"],
              example: "ACTIVE",
            },
            firebaseUid: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },

  apis: apiFiles,

  failOnErrors: false,
};

export const swaggerSpec =
  swaggerJSDoc(options);