import type { VercelRequest, VercelResponse } from "@vercel/node";
import { products } from "../src/data/products"; // Using existing data as our mock DB

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Simulate a slight database delay for realism
  setTimeout(() => {
    res.status(200).json(products);
  }, 600);
}
