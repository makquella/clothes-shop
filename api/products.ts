import type { VercelRequest, VercelResponse } from "@vercel/node";

const products = [
  { id: "decon-jacket-01", name: "Asymmetric Deconstructed Jacket", description: "Raw-edge oversized blazer with exposed seams and asymmetric lapels. Washed black cotton with deliberate distressing. Inspired by Comme des Garçons SS99.", price: 8900, currency: "UAH", sizes: ["S", "M", "L", "XL"], styles: ["deconstructed", "oversize"], imageUrls: ["/images/jacket-01.png", "/images/jacket-01-2.png", "/images/jacket-01-3.png"], color: "#1a1a1a", inStock: true },
  { id: "ripped-denim-02", name: "Ripped Archive Denim", description: "Distressed wide-leg jeans with shredded knees and raw hem. Vintage wash with visible repair stitching. Archive silhouette.", price: 5400, currency: "UAH", sizes: ["XS", "S", "M", "L", "XL"], styles: ["ripped", "archival"], imageUrls: ["/images/denim-02.png", "/images/denim-02-2.png", "/images/denim-02-3.png"], color: "#2c3e50", inStock: true },
  { id: "drape-tee-03", name: "Draped Elongated Tee", description: "Floor-length proportions with cascading side drape. Bamboo jersey blend in faded charcoal. Rick Owens geometry meets comfort.", price: 3200, currency: "UAH", sizes: ["S", "M", "L", "XL", "XXL"], styles: ["oversize", "deconstructed"], imageUrls: ["/images/tee-03.png", "/images/tee-03-2.png", "/images/tee-03-3.png"], color: "#333333", inStock: true },
  { id: "cargo-pant-04", name: "Reconstructed Military Cargo", description: "Vintage military cargos rebuilt with inverted pockets and asymmetric leg cuts. Each pair is unique — cut from deadstock BDU pants.", price: 6700, currency: "UAH", sizes: ["S", "M", "L"], styles: ["reconstructed", "archival"], imageUrls: ["/images/cargo-04.png", "/images/cargo-04-2.png", "/images/cargo-04-3.png"], color: "#3d3d3d", inStock: true },
  { id: "bomber-05", name: "Distressed Parachute Bomber", description: "Oversized cropped bomber in rip-stop nylon with deliberate tear patterns and hanging thread details. Inspired by post-apocalyptic workwear.", price: 7800, currency: "UAH", sizes: ["M", "L", "XL"], styles: ["ripped", "oversize"], imageUrls: ["/images/bomber-05.png", "/images/bomber-05-2.png", "/images/bomber-05-3.png"], color: "#1c1c1c", inStock: true },
  { id: "hoodie-06", name: "Raw-Cut Oversized Hoodie", description: "Heavyweight French terry hoodie with unfinished edges and exaggerated drop shoulders. Double-layered hood with exposed construction.", price: 4500, currency: "UAH", sizes: ["S", "M", "L", "XL", "XXL"], styles: ["oversize", "deconstructed"], imageUrls: ["/images/hoodie-06.png", "/images/hoodie-06-2.png", "/images/hoodie-06-3.png"], color: "#0d0d0d", inStock: true },
  { id: "vest-07", name: "Deconstructed Tailored Vest", description: "Pinstripe suiting vest reworked with exposed lining, missing buttons, and frayed edges. Corporate devastation aesthetic.", price: 4100, currency: "UAH", sizes: ["XS", "S", "M", "L"], styles: ["deconstructed", "archival"], imageUrls: ["/images/vest-07.png", "/images/vest-07-2.png", "/images/vest-07-3.png"], color: "#2a2a2a", inStock: true },
  { id: "trousers-08", name: "Pleated Wide-Leg Trousers", description: "Ultra-wide silhouette with deep pleats and draped ankle pooling. Matte black viscose blend. Yohji Yamamoto proportions.", price: 5900, currency: "UAH", sizes: ["S", "M", "L", "XL"], styles: ["oversize", "archival"], imageUrls: ["/images/trousers-08.png", "/images/trousers-08-2.png", "/images/trousers-08-3.png"], color: "#111111", inStock: true },
  { id: "coat-09", name: "Shredded Long Coat", description: "Floor-length duster coat with deliberate slash marks and hanging fabric strips. Raw wool blend in midnight black. Statement outerwear.", price: 12500, currency: "UAH", sizes: ["M", "L", "XL"], styles: ["ripped", "deconstructed", "oversize"], imageUrls: ["/images/coat-09.png", "/images/coat-09-2.png", "/images/coat-09-3.png"], color: "#0a0a0a", inStock: true },
  { id: "shirt-10", name: "Inside-Out Button Shirt", description: "Classic dress shirt worn inside-out by design. Exposed seams become the pattern. Bleach-spattered white cotton with yellowed vintage wash.", price: 3800, currency: "UAH", sizes: ["XS", "S", "M", "L", "XL"], styles: ["reconstructed", "deconstructed"], imageUrls: ["/images/shirt-10.png", "/images/shirt-10-2.png", "/images/shirt-10-3.png"], color: "#e8e0d4", inStock: true }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Simulate a slight database delay for realism
  setTimeout(() => {
    res.status(200).json(products);
  }, 600);
}
