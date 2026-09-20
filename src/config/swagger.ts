import path from "path";
import swaggerJSDoc from "swagger-jsdoc";

import fs from "fs";

const isDist = !fs.existsSync(path.resolve(process.cwd(), "src/app.ts"));
const baseDir = isDist ? "dist" : "src";
const ext = isDist ? "js" : "ts";

const apiFiles = [
  path.resolve(process.cwd(), `${baseDir}/app.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/auth/auth.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/users/users.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/assembly/assembly.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/booths/booths.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/volunteer/volunteer.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/volunteer-auth/volunteer-auth.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/voters/voters.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/volunteer-voters/volunteer-voters.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/classification/classification.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/analytics/analytics.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/booth-analysis/booth-analysis.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/reports/reports.routes.${ext}`),
  path.resolve(process.cwd(), `${baseDir}/modules/settings/settings.routes.${ext}`),
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
      {
        name: "Classification",
        description: "Voter political classification (Green, Yellow, Red, Black)",
      },
      {
        name: "Analytics",
        description: "Electoral and operational analytics",
      },
      {
        name: "Booth Analysis",
        description: "Detailed booth strength, weakness, opportunity, and confidence analysis",
      },
      {
        name: "Reports",
        description: "System reports and Excel/CSV exports",
      },
      {
        name: "Settings",
        description: "Configurable system analysis thresholds",
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
},
  },

  apis: apiFiles,

  failOnErrors: false,
};

export const swaggerSpec =
  swaggerJSDoc(options);