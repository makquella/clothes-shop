import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MOCK_CITIES, MOCK_BRANCHES } from "../src/data/locations";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const query = req.query.q as string;
  const city = req.query.city as string;

  // Retrieve branches for a specific city
  if (city) {
    const branches = MOCK_BRANCHES[city] || [];
    const branchQuery = query ? query.toLowerCase() : "";
    const results = branches.filter((b: string) => b.toLowerCase().includes(branchQuery));
    
    // Simulate latency for the frontend loaders
    setTimeout(() => res.status(200).json(results), 400);
    return;
  }
  
  // Retrieve cities globally
  if (!query || query.length < 2) {
    return res.status(200).json([]);
  }

  const q = query.toLowerCase();
  const results = MOCK_CITIES.filter((c: string) => c.toLowerCase().includes(q));

  setTimeout(() => {
    res.status(200).json(results);
  }, 400);
}
