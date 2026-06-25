export type ShipmentStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';

export type ProductType =
  | 'electronica'
  | 'ropa'
  | 'alimentos'
  | 'documentos'
  | 'fragil'
  | 'peligroso';

export interface Shipment {
  id: number;
  userId: number;
  carrierId: number | null;
  routeId: number | null;
  weight: number;
  volumeM3: number;
  productType: ProductType;
  destAddress?: string;
  destCity: string;
  destCountry?: string;
  destZip?: string;
  status: ShipmentStatus;
  createdAt: string;
}

export interface CreateShipmentPayload {
  weight: number;
  width: number;
  height: number;
  length: number;
  productType: ProductType;
  destAddress: string;
  destCity: string;
  destCountry: string;
  destZip: string;
}

export interface UpdateStatusPayload {
  status: 'in_transit' | 'delivered' | 'cancelled';
  notes?: string;
}
