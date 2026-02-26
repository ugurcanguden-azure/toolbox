"use server";

export async function convertToWord(formData: FormData) {
  const file = formData.get("file") as File;

  if (!file || file.type !== "application/pdf") {
    return { error: "Invalid file. Please upload a PDF file.", data: null };
  }

  const STIRLING_PDF_URL =
    process.env.STIRLING_PDF_URL || "https://pdf.curioboxapp.info";
  const STIRLING_PDF_API_KEY = process.env.STIRLING_PDF_API_KEY || "";

  try {
    const apiFormData = new FormData();
    apiFormData.append("fileInput", file);
    apiFormData.append("outputFormat", "docx");

    const headers: Record<string, string> = {};
    if (STIRLING_PDF_API_KEY) {
      headers["X-API-Key"] = STIRLING_PDF_API_KEY;
    }

    const response = await fetch(
      `${STIRLING_PDF_URL}/api/v1/convert/pdf/word`,
      {
        method: "POST",
        headers,
        body: apiFormData,
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          error: "API authentication failed. Please check the API key.",
          data: null,
        };
      }
      const errorText = await response.text().catch(() => "Unknown error");
      return {
        error: `Conversion failed (${response.status}): ${errorText}`,
        data: null,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Extract filename from Content-Disposition header or generate one
    const contentDisposition = response.headers.get("content-disposition");
    let fileName = "converted.docx";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        fileName = match[1].replace(/['"]/g, "");
      }
    }

    return {
      error: null,
      data: {
        base64,
        fileName,
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        error:
          "Could not connect to PDF conversion service. Please try again later.",
        data: null,
      };
    }
    return {
      error: "An unexpected error occurred during conversion.",
      data: null,
    };
  }
}
