// 📂 middlewares/zodSchemaValidator.js

const zodSchemaValidator = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      // log entire error for debugging
      console.error("🧩 Zod Validation Error:", error);

      // get raw errors (Zod normally puts structured info in error.errors)
      const raw = error && error.errors !== undefined ? error.errors : null;

      let parsedErrors;

      // 1) If raw is already an array -> use it
      if (Array.isArray(raw)) {
        parsedErrors = raw;
      } else if (typeof raw === "string") {
        // 2) If raw is a string (stringified JSON) -> try to parse
        try {
          parsedErrors = JSON.parse(raw);
        } catch (parseErr) {
          // 3) Sometimes the string contains pretty-printed JSON with newlines/escapes.
          // Try to extract the JSON array substring between first '[' and last ']'
          const match = raw.match(/(\[.*\])/s); // s flag for dotAll
          if (match) {
            try {
              parsedErrors = JSON.parse(match[1]);
            } catch (innerErr) {
              // give up parsing — show the raw string as a single message
              parsedErrors = [{ message: raw }];
            }
          } else {
            parsedErrors = [{ message: raw }];
          }
        }
      } else if (raw == null && error && Array.isArray(error?.issues)) {
        // Zod v3 can also have `error.issues` in some contexts
        parsedErrors = error.issues;
      } else if (Array.isArray(error?.issues)) {
        parsedErrors = error.issues;
      } else if (Array.isArray(error)) {
        // defensive
        parsedErrors = error;
      } else {
        // final fallback: single message from error.message
        parsedErrors = [{ message: error?.message || "Invalid request body" }];
      }

      // Map into a consistent, human-friendly shape
      const formattedErrors = parsedErrors.map((err) => {
        // err could be a string in some odd cases
        if (typeof err === "string") {
          return { field: "unknown", message: err };
        }

        const path = Array.isArray(err.path) ? err.path.join(".") : (err.path || err?.field || "unknown");
        return {
          field: path,
          message: err.message || String(err) || "Invalid value",
          code: err.code,
          expected: err.expected,
          received: err.received,
        };
      });

      return res.status(400).json({
        success: false,
        message: "🧩 Zod Validation Error",
        errors: formattedErrors,
      });
    }
  };
};



module.exports = zodSchemaValidator;
