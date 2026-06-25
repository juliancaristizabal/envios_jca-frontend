export interface Carrier {
  id: number;
  name: string;
  phone: string;
  vehicleType: 'moto' | 'van' | 'camion';
  capacityKg: number;
  capacityM3: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface Route {
  id: number;
  name: string;
  originCity: string;
  destinationCity: string;
  estimatedDays: number;
  createdAt: string;
}

export interface AssignShipmentPayload {
  carrierId: number;
  routeId: number;
}

export interface CreateCarrierPayload {
  name: string;
  phone: string;
  vehicleType: 'moto' | 'van' | 'camion';
  capacityKg: number;
  capacityM3: number;
}
