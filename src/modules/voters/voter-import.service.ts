import * as XLSX from "xlsx";

import { prisma } from "../../config/prisma";

/**
 * Excel row structure
 *
 * Based on your voter Excel file.
 */
export interface RawExcelVoter {
  epicNo?: unknown;

  epicName?: unknown;

  epicName1?: unknown;

  Gender?: unknown;

  mobileNo?: unknown;

  enrollDob?: unknown;

  Age?: unknown;

  fathersOrGuardian?: unknown;

  fathersOrGuardianHindi?: unknown;

  mothersName?: unknown;

  spouseName?: unknown;

  houseNo?: unknown;

  acNo?: unknown;

  partNo?: unknown;

  partSerial?: unknown;

  pollingStation?: unknown;
}

/**
 * Clean string value
 */
function cleanString(
  value: unknown
): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const result =
    String(value).trim();

  return result.length > 0
    ? result
    : null;
}

/**
 * Clean mobile
 *
 * Handles Excel:
 *
 * 9876543210
 *
 * and:
 *
 * 9876543210.0
 */
function cleanMobile(
  value: unknown
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  let mobile =
    String(value).trim();

  if (
    mobile.endsWith(".0")
  ) {
    mobile =
      mobile.slice(0, -2);
  }

  return mobile || null;
}

/**
 * Clean number
 */
function cleanNumber(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const number =
    Number(value);

  if (
    Number.isNaN(number)
  ) {
    return null;
  }

  return number;
}

/**
 * Read Excel / XLS / CSV
 */
export function parseVoterExcel(
  filePath: string
): RawExcelVoter[] {
  const workbook =
    XLSX.readFile(
      filePath,
      {
        cellDates: false,
      }
    );

  const sheetName =
    workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error(
      "Excel file has no worksheet"
    );
  }

  const worksheet =
    workbook.Sheets[
      sheetName
    ];

  const rows =
    XLSX.utils.sheet_to_json<RawExcelVoter>(
      worksheet,
      {
        defval: null,
        raw: false,
      }
    );

  return rows.map(
    (row) => ({
      epicNo:
        cleanString(
          row.epicNo
        ),

      epicName:
        cleanString(
          row.epicName
        ),

      epicName1:
        cleanString(
          row.epicName1
        ),

      Gender:
        cleanString(
          row.Gender
        ),

      mobileNo:
        cleanMobile(
          row.mobileNo
        ),

      enrollDob:
        cleanString(
          row.enrollDob
        ),

      Age:
        cleanNumber(
          row.Age
        ),

      fathersOrGuardian:
        cleanString(
          row.fathersOrGuardian
        ),

      fathersOrGuardianHindi:
        cleanString(
          row.fathersOrGuardianHindi
        ),

      mothersName:
        cleanString(
          row.mothersName
        ),

      spouseName:
        cleanString(
          row.spouseName
        ),

      houseNo:
        cleanString(
          row.houseNo
        ),

      acNo:
        cleanString(
          row.acNo
        ),

      partNo:
        cleanString(
          row.partNo
        ),

      partSerial:
        cleanString(
          row.partSerial
        ),

      pollingStation:
        cleanString(
          row.pollingStation
        ),
    })
  );
}

/**
 * Import voter file
 */
export async function importVoterFile(
  filePath: string,
  fileName: string,
  fileType: string,
  uploadedById: string,
  assemblyId: string
) {
  /**
   * Check Assembly
   */
  const assembly =
    await prisma.assembly.findUnique(
      {
        where: {
          id: assemblyId,
        },
      }
    );

  if (!assembly) {
    throw new Error(
      "Assembly not found"
    );
  }

  /**
   * Create ImportBatch
   */
  const batch =
    await prisma.importBatch.create(
      {
        data: {
          fileName,

          fileType,

          uploadedById,

          status: "REVIEWING",
        },
      }
    );

  let rows: RawExcelVoter[];

  /**
   * Parse file
   */
  try {
    rows =
      parseVoterExcel(
        filePath
      );
  } catch (error) {
    await prisma.importBatch.update(
      {
        where: {
          id: batch.id,
        },

        data: {
          status: "FAILED",
        },
      }
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "Unable to read voter file"
    );
  }

  const totalRows =
    rows.length;

  let validRows = 0;
  let duplicateRows = 0;
  let errorRows = 0;
  let importedRows = 0;

  /**
   * Track EPIC numbers in
   * current file.
   */
  const seenEpics =
    new Set<string>();

  /**
   * Process rows
   */
  for (
    let index = 0;
    index < rows.length;
    index++
  ) {
    const row =
      rows[index];

    /**
     * Excel data starts
     * from row 2.
     */
    const rowNumber =
      index + 2;

    try {
      /**
       * EPIC
       */
      const epicValue =
        cleanString(
          row.epicNo
        );

      const epic =
        epicValue
          ?.toUpperCase();

      /**
       * Name
       */
      const name =
        cleanString(
          row.epicName
        );

      /**
       * Part number =
       * Booth number
       */
      const boothNumber =
        cleanString(
          row.partNo
        );

      /**
       * Required validations
       */
      if (!epic) {
        throw new Error(
          "EPIC number is missing"
        );
      }

      if (!name) {
        throw new Error(
          "Voter name is missing"
        );
      }

      if (!boothNumber) {
        throw new Error(
          "Part/Booth number is missing"
        );
      }

      /**
       * Duplicate EPIC
       * inside uploaded file
       */
      if (
        seenEpics.has(epic)
      ) {
        duplicateRows++;

        throw new Error(
          `Duplicate EPIC in uploaded file: ${epic}`
        );
      }

      seenEpics.add(epic);

      /**
       * Find booth
       *
       * Example:
       *
       * Excel partNo = 1
       *
       * DB boothNumber = "1"
       */
      const booth =
        await prisma.booth.findUnique(
          {
            where: {
              assemblyId_boothNumber:
                {
                  assemblyId,

                  boothNumber,
                },
            },
          }
        );

      if (!booth) {
        throw new Error(
          `Booth ${boothNumber} not found in selected assembly`
        );
      }

      validRows++;

      /**
       * Find existing voter
       *
       * EPIC is unique per assembly.
       */
      const existing =
        await prisma.voter.findUnique(
          {
            where: {
              assemblyId_epic: {
                assemblyId,

                epic,
              },
            },
          }
        );

      /**
       * Official voter data
       *
       * These fields are safe
       * to update during import.
       */
      const officialData = {
        name,

        fatherName:
          cleanString(
            row.fathersOrGuardian
          ),

        motherName:
          cleanString(
            row.mothersName
          ),

        husbandName:
          cleanString(
            row.spouseName
          ),

        houseNumber:
          cleanString(
            row.houseNo
          ),

        gender:
          cleanString(
            row.Gender
          ),

        age:
          cleanNumber(
            row.Age
          ),

        assemblyId,

        boothId:
          booth.id,
      };

      /**
       * Existing voter
       *
       * IMPORTANT:
       *
       * We do NOT update:
       *
       * mobile
       * classification
       * verification
       * voteStatus
       */
      if (existing) {
        await prisma.voter.update(
          {
            where: {
              id: existing.id,
            },

            data: officialData,
          }
        );
      }

      /**
       * New voter
       */
      else {
        await prisma.voter.create(
          {
            data: {
              epic,

              ...officialData,

              /**
               * New voter gets
               * Excel mobile.
               */
              mobile:
                cleanMobile(
                  row.mobileNo
                ),

              verification:
                "UNVERIFIED",

              voteStatus:
                "PENDING",
            },
          }
        );
      }

      importedRows++;
    } catch (error) {
      errorRows++;

      await prisma.importError.create(
        {
          data: {
            batchId: batch.id,

            rowNumber,

            rawData:
              JSON.parse(
                JSON.stringify(row)
              ),

            errorMessage:
              error instanceof Error
                ? error.message
                : "Unknown import error",
          },
        }
      );
    }
  }

  /**
   * Mark import completed
   */
  const completedBatch =
    await prisma.importBatch.update(
      {
        where: {
          id: batch.id,
        },

        data: {
          status: "COMMITTED",

          totalRows,

          validRows,

          duplicateRows,

          errorRows,

          importedRows,

          completedAt:
            new Date(),
        },
      }
    );

  /**
   * Audit log
   */
  await prisma.auditLog.create({
    data: {
      action:
        "VOTER_IMPORT_COMPLETED",

      entity:
        "IMPORT_BATCH",

      entityId: batch.id,

      userId: uploadedById,

      details: {
        fileName,

        assemblyId,

        totalRows,

        validRows,

        duplicateRows,

        errorRows,

        importedRows,
      },
    },
  });

  return completedBatch;
}