import mime from "mime-types";

export async function convertBase64ToFile(base64: string, filename: string) {
  const convertedFile = await base64ToFile(base64, filename);
  return convertedFile;
}

export async function base64ToFile(
  base64String: string,
  fileName: string,
  customFileType?: string,
): Promise<File> {
  let fileType = base64String.split(";")[0].split("/")[1];
  let fileExtension = customFileType || mime.lookup(fileType) || "";

  if (
    fileType.includes("vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  ) {
    fileType = "xlsx";
    fileExtension =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }

  const res = await fetch(base64String);
  const blob = await res.blob();
  return new File([blob], `${fileName}.${fileType}`, {
    type: fileExtension,
  });
}
