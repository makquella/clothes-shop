export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  sizes: string[];
  styles: Style[];
  imageUrls: string[];
  color: string;
  inStock: boolean;
}

export type Style = "ripped" | "archival" | "oversize" | "deconstructed" | "reconstructed";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface FilterState {
  selectedSizes: string[];
  selectedStyles: Style[];
  priceRange: [number, number];
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  deliveryMethod: "nova_poshta" | "address";
  city: string;
  street?: string;
  houseNumber?: string;
  novaPoshtaBranch?: string;
  paymentMethod: "liqpay" | "stars";
  notes: string;
}
