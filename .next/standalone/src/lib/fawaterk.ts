import * as dotenv from "dotenv";
dotenv.config();

const FAWATERK_BASE_URL = "https://app.fawaterk.com/api/v2";

export interface FawaterkCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface FawaterkCartItem {
  name: string;
  price: string | number;
  quantity: string | number;
}

export interface FawaterkInvoiceRequest {
  cartTotal: string;
  currency: string;
  customer: FawaterkCustomer;
  cartItems: FawaterkCartItem[];
  redirectionUrls?: {
    successUrl: string;
    failUrl: string;
    pendingUrl: string;
  };
  shipping?: number;
  discountData?: {
    type: "pcg" | "literal";
    value: number;
  };
  callback_url?: string;
  return_url?: string;
  sendEmail?: boolean;
  sendSMS?: boolean;
}

export async function createFawaterkInvoice(data: FawaterkInvoiceRequest) {
  const apiKey = process.env.FAWATERK_API_KEY;

  if (!apiKey) {
    console.error(
      "FAWATERK_API_KEY is not defined in the environment variables.",
    );
    throw new Error("Missing Fawaterk API configuration.");
  }

  try {
    console.log(
      "Fawaterk - Sending Request to createInvoiceLink:",
      JSON.stringify(data, null, 2),
    );
    const response = await fetch(`${FAWATERK_BASE_URL}/createInvoiceLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get("content-type");
    let responseData: any;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      console.error("Fawaterk API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      });

      let errorMessage = `Fawaterk API Error: ${response.status} ${response.statusText}`;

      if (typeof responseData === "object" && responseData !== null) {
        if (typeof responseData.message === "string") {
          errorMessage = responseData.message;
        } else if (typeof responseData.message === "object") {
          // If message is an object (like validation errors), stringify it
          errorMessage = JSON.stringify(responseData.message);
        } else if (responseData.error) {
          errorMessage =
            typeof responseData.error === "string"
              ? responseData.error
              : JSON.stringify(responseData.error);
        }
      }

      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error: any) {
    console.error("Fawaterk Integration Exception:", {
      message: error.message,
      stack: error.stack,
      error: error,
    });
    throw error;
  }
}
