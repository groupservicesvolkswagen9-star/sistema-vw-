const { Storage } =
  require("@google-cloud/storage");

const storage =
  new Storage({

    credentials:
      JSON.parse(
        process.env
          .GOOGLE_CREDENTIALS
      )

  });

const bucket =
  storage.bucket(
    "vwgs-documentos"
  );

module.exports =
  bucket;