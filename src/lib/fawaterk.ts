const FAWATERK_API_KEY = process.env.FAWATERK_API_KEY;
const FAWATERK_BASE_URL = "https://app.fawaterk.com/api/v2";

export interface FawaterkCustomer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface FawaterkCartItem {
  name: string;
  price: number;
  quantity: number;
}

export interface FawaterkInvoiceRequest {
  cartTotal: string;
  currency: string;
  customer: FawaterkCustomer;
  cartItems: FawaterkCartItem[];
  callback_url?: string;
  return_url?: string;
}

export async function createFawaterkInvoice(data: FawaterkInvoiceRequest) {
  try {
    const response = await fetch(`${FAWATERK_BASE_URL}/invoice/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FAWATERK_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Fawaterk API Error:", errorData);
      throw new Error(errorData.message || "Failed to create Fawaterk invoice");
    }

    return await response.json();
  } catch (error) {
    console.error("Fawaterk Integration Error:", error);
    throw error;
  }
}
