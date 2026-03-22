import type { VercelRequest, VercelResponse } from "@vercel/node";

const MOCK_CITIES = [
  "Kyiv", "Kharkiv", "Odesa", "Dnipro", "Lviv", 
  "Zaporizhzhia", "Kryvyi Rih", "Mykolaiv", "Vinnytsia", "Poltava"
];

const MOCK_BRANCHES: Record<string, string[]> = {
  "Kyiv": ["Branch №1 (up to 30 kg): vul. Khreshchatyk, 22", "Branch №2 (up to 1000 kg): vul. Bohatyrska, 11", "Branch №15 (up to 30 kg): prosp. Obolonskyi, 42", "Branch №248 (up to 30 kg): vul. Velyka Vasylkivska, 132", "Branch №305 (Postomat): prosp. Peremohy, 67"],
  "Kharkiv": ["Branch №1 (up to 1000 kg): vul. Poltavskyi Shliakh, 115", "Branch №4 (up to 30 kg): vul. Akademika Pavlova, 120", "Branch №12 (up to 30 kg): prosp. Nauky, 40", "Branch №56 (Postomat): vul. Pushkinska, 67"],
  "Lviv": ["Branch №1 (up to 1000 kg): vul. Horodotska, 359", "Branch №3 (up to 30 kg): vul. Ugorska, 14", "Branch №14 (up to 30 kg): vul. Kulparkivska, 226a (Victoria Gardens)", "Branch №67 (Postomat): vul. Chornovola, 57"],
  "Odesa": ["Branch №1 (up to 1000 kg): vul. Bazarna, 11", "Branch №3 (up to 30 kg): vul. Deribasivska, 22", "Branch №5 (up to 30 kg): prosp. Shevchenka, 4d", "Branch №42 (Postomat): vul. Genuezka, 24"],
  "Dnipro": ["Branch №1 (up to 1000 kg): vul. Marshala Malynovskoho, 98a", "Branch №4 (up to 30 kg): prosp. Dmytra Yavornytskoho, 100", "Branch №6 (up to 30 kg): prosp. Gagarina, 43", "Branch №21 (Postomat): vul. Titova, 36"]
};

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
