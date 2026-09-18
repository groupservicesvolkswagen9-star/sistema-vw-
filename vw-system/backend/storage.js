const { Storage } =
  require("@google-cloud/storage");

const storage =
  new Storage({
    keyFilename:
      "./service-account.json"
  });

const bucket =
  storage.bucket(
    "vwgs-documentos"
  );

module.exports =
  bucket;