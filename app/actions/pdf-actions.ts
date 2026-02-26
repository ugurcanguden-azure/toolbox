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

export async function mergePdfs(formData: FormData) {
  const files: File[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("fileInput_") && typeof value !== "string") {
      files.push(value as File);
    }
  }

  if (!files || files.length < 2) {
    return { error: "Please upload at least two PDF files to merge.", data: null };
  }

  for (const file of files) {
    if (file.type !== "application/pdf") {
      return { error: "Invalid file type. All files must be PDFs.", data: null };
    }
  }

  const STIRLING_PDF_URL = process.env.STIRLING_PDF_URL || "https://pdf.curioboxapp.info";
  const STIRLING_PDF_API_KEY = process.env.STIRLING_PDF_API_KEY || "";

  try {
    const apiFormData = new FormData();
    files.forEach((file) => {
      apiFormData.append("fileInput", file);
    });

    const headers: Record<string, string> = {};
    if (STIRLING_PDF_API_KEY) {
      headers["X-API-Key"] = STIRLING_PDF_API_KEY;
    }

    const response = await fetch(`${STIRLING_PDF_URL}/api/v1/general/merge-pdfs`, {
      method: "POST",
      headers,
      body: apiFormData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { error: "API authentication failed. Please check the API key.", data: null };
      }
      const errorText = await response.text().catch(() => "Unknown error");
      return { error: `Merge failed (${response.status}): ${errorText}`, data: null };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const contentDisposition = response.headers.get("content-disposition");
    let fileName = "merged.pdf";
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
        mimeType: "application/pdf",
      },
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { error: "Could not connect to PDF service. Please try again later.", data: null };
    }
    return { error: "An unexpected error occurred during merge.", data: null };
  }
}

export async function protectPdf(formData: FormData) {
  const file = formData.get("fileInput") as File;
  const password = formData.get("password") as string;

  if (!file || file.type !== "application/pdf") {
    return { error: "Invalid file. Please upload a PDF file.", data: null };
  }
  if (!password) {
    return { error: "Password is required.", data: null };
  }

  const STIRLING_PDF_URL = process.env.STIRLING_PDF_URL || "https://pdf.curioboxapp.info";
  const STIRLING_PDF_API_KEY = process.env.STIRLING_PDF_API_KEY || "";

  try {
    const apiFormData = new FormData();
    apiFormData.append("fileInput", file);
    apiFormData.append("password", password);

    const headers: Record<string, string> = {};
    if (STIRLING_PDF_API_KEY) {
      headers["X-API-Key"] = STIRLING_PDF_API_KEY;
    }

    const response = await fetch(`${STIRLING_PDF_URL}/api/v1/security/add-password`, {
      method: "POST",
      headers,
      body: apiFormData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { error: "API authentication failed.", data: null };
      }
      const errorText = await response.text().catch(() => "Unknown error");
      return { error: `Protection failed (${response.status}): ${errorText}`, data: null };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const contentDisposition = response.headers.get("content-disposition");
    let fileName = "protected.pdf";
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
        mimeType: "application/pdf",
      },
    };
  } catch (error) {
    return { error: "An unexpected error occurred during protection.", data: null };
  }
}

export async function pdfToImage(formData: FormData) {
  const file = formData.get("fileInput") as File;

  if (!file || file.type !== "application/pdf") {
    return { error: "Invalid file. Please upload a PDF file.", data: null };
  }

  const STIRLING_PDF_URL = process.env.STIRLING_PDF_URL || "https://pdf.curioboxapp.info";
  const STIRLING_PDF_API_KEY = process.env.STIRLING_PDF_API_KEY || "";

  try {
    const apiFormData = new FormData();
    apiFormData.append("fileInput", file);
    apiFormData.append("imageFormat", "png");
    apiFormData.append("multiple", "true");
    apiFormData.append("dpi", "300");

    const headers: Record<string, string> = {};
    if (STIRLING_PDF_API_KEY) {
      headers["X-API-Key"] = STIRLING_PDF_API_KEY;
    }

    const response = await fetch(`${STIRLING_PDF_URL}/api/v1/convert/pdf/img`, {
      method: "POST",
      headers,
      body: apiFormData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { error: "API authentication failed.", data: null };
      }
      const errorText = await response.text().catch(() => "Unknown error");
      return { error: `Conversion failed (${response.status}): ${errorText}`, data: null };
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const contentDisposition = response.headers.get("content-disposition");
    let fileName = "images.zip"; // usually returns zip if multiple images
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
        mimeType: response.headers.get("content-type") || "application/zip",
      },
    };
  } catch (error) {
    return { error: "An unexpected error occurred during conversion.", data: null };
  }
}
