const admin = require("firebase-admin");

console.log(
  "FIREBASE_SERVICE_ACCOUNT:",
  !!process.env.FIREBASE_SERVICE_ACCOUNT
);

const serviceAccount =
  JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

console.log(
  "PROJECT:",
  serviceAccount.project_id
);

process.exit(0);