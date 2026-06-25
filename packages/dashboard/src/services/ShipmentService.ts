import { httpClient } from './http/FetchHttpClient';
import type { IHttpClient } from './http/IHttpClient';
import type { Shipment, CreateShipmentPayload, UpdateStatusPayload } from '../types/shipment';

export class ShipmentService {
  constructor(private readonly http: IHttpClient = httpClient) {}

  async getMyShipments(token: string): Promise<Shipment[]> {
    const data = await this.http.get<{ data: Shipment[] }>('/shipments/my', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  }

  async createShipment(token: string, payload: CreateShipmentPayload): Promise<Shipment> {
    const data = await this.http.post<{ data: Shipment }>('/shipments', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  }

  async updateStatus(token: string, id: number, payload: UpdateStatusPayload): Promise<void> {
    await this.http.patch(`/shipments/${id}/status`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const shipmentService = new ShipmentService();
