const PRODUCT_CODE = import.meta.env.VITE_ESEWA_PRODUCT_CODE ?? "EPAYTEST";
const SECRET_KEY = import.meta.env.VITE_ESEWA_SECRET_KEY ?? "8gBm/:&EnhH.1/q";
const BASE_URL =
  import.meta.env.VITE_ESEWA_BASE_URL ?? "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

async function hmacSha256Base64(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export async function initiateEsewaPayment({
  amount,
  transactionUuid,
  successUrl,
  failureUrl,
}: {
  amount: number;
  transactionUuid: string;
  successUrl: string;
  failureUrl: string;
}) {
  const totalAmount = amount.toFixed(2);
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${PRODUCT_CODE}`;
  const signature = await hmacSha256Base64(message, SECRET_KEY);

  const fields: Record<string, string> = {
    amount: totalAmount,
    tax_amount: "0",
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: PRODUCT_CODE,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: successUrl,
    failure_url: failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };

  const form = document.createElement("form");
  form.method = "POST";
  form.action = BASE_URL;

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export function generateTransactionUuid(): string {
  return `PC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
