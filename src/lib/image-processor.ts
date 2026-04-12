import cloudinary from "./cloudinary";

export async function processAndUploadImage(
  file: File | Buffer,
  folder: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {},
) {
  const { maxWidth = 1200, maxHeight = 1200, quality = "auto" } = options;

  let buffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } else {
    buffer = file;
  }

  return new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `eldokanh/${folder}`,
          transformation: [
            { width: maxWidth, height: maxHeight, crop: "limit" },
            { quality: quality },
            { fetch_format: "webp" },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Cloudinary upload failed"));

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      uploadStream.end(buffer);
    },
  );
}
