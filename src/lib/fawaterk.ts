const FAWATERK_API_KEY = process.env.FAWATERK_API_KEY;
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
  try {
    console.log("Fawaterk - Sending Request to createInvoiceLink:", JSON.stringify(data, null, 2));
    const response = await fetch(`${FAWATERK_BASE_URL}/createInvoiceLink`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FAWATERK_API_KEY}`,
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
      
      const errorMessage = (typeof responseData === 'object' ? responseData.message : null) 
        || `Fawaterk API Error: ${response.status} ${response.statusText}`;
      
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error: any) {
    console.error("Fawaterk Integration Exception:", {
      message: error.message,
      stack: error.stack,
      error: error
    });
    throw error;
  }
}
