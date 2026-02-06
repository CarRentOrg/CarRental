import ImageKit, { toFile } from "@imagekit/nodejs";
import { imagekit } from "../config/imagekit";

export const uploadToImageKit = async (
  file: Express.Multer.File,
  folder: string = "/car-rental",
): Promise<{ url: string; fileId: string }> => {
  try {
    const response = await imagekit.files.upload({
      file: await toFile(file.buffer, file.originalname),
      fileName: `${Date.now()}-${file.originalname}`,
      folder,
    });

    if (!response.url || !response.fileId) {
      throw new Error("ImageKit did not return a URL or fileId");
    }

    return { url: response.url, fileId: response.fileId };
  } catch (error) {
    console.error("ImageKit upload error:", error);
    throw error;
  }
};

export const deleteFromImageKit = async (fileId: string) => {
  try {
    // @ts-ignore
    await (imagekit.files as any).deleteFile(fileId);
    console.log(`Deleted file from ImageKit: ${fileId}`);
  } catch (error) {
    console.error("Failed to delete file from ImageKit:", error);
  }
};
