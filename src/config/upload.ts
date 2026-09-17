import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },

  filename: (_req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedExtensions = [
      ".xlsx",
      ".xls",
      ".csv",
    ];

    const extension =
      file.originalname
        .toLowerCase()
        .slice(
          file.originalname.lastIndexOf(".")
        );

    if (!allowedExtensions.includes(extension)) {
      return cb(
        new Error(
          "Only XLSX, XLS and CSV files are allowed"
        )
      );
    }

    cb(null, true);
  },
});