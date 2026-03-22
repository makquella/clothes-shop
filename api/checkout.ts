import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const orderData = req.body;

  // If no token is provided, just simulate success for the demo/portfolio
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("[Mock Checkout] Received order payload:", orderData);
    return res.status(200).json({ 
      success: true, 
      message: "Order received in Demo Mode (No Telegram credentials provided)." 
    });
  }

  // Format order text for Telegram
  const itemsText = orderData.items?.map((i: any) => 
    `- ${i.name} (Size: ${i.size}) x${i.quantity} = ${i.price * i.quantity} UAH`
  ).join("\n");

  const messageText = `
🛍️ *NEW ORDER [#${Math.floor(Math.random() * 10000)}]*
━━━━━━━━━━━━━━━
*Customer*: ${orderData.firstName} ${orderData.lastName}
*Phone*: ${orderData.phone}
${orderData.email ? `*Email*: ${orderData.email}\n` : ''}
*Delivery*: Nova Poshta, ${orderData.city}, ${orderData.branch}
*Payment*: ${orderData.paymentMethod}
━━━━━━━━━━━━━━━
*Items*:
${itemsText}
━━━━━━━━━━━━━━━
*Total*: ${orderData.totalPrice} UAH
  `;

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: messageText,
        parse_mode: "Markdown"
      })
    });

    if (!tgResponse.ok) {
      const errorMsg = await tgResponse.text();
      console.error("Telegram error payload:", errorMsg);
      throw new Error(`Telegram API Error`);
    }

    return res.status(200).json({ success: true, message: "Order processed successfully." });
  } catch (error: any) {
    console.error("Checkout dispatch failed:", error);
    return res.status(500).json({ success: false, message: "Failed to dispatch order.", error: error.message });
  }
}
