import { httpClient } from './http/FetchHttpClient';
import type { IHttpClient } from './http/IHttpClient';
import type { Shipment } from '../types/shipment';
import type { Carrier, Route, AssignShipmentPayload } from '../types/admin';

export class AdminService {
  constructor(private readonly http: IHttpClient = httpClient) {}

  async getAllShipments(token: string): Promise<Shipment[]> {
    const data = await this.http.get<{ data: Shipment[] }>('/shipments', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  }

  async getAvailableCarriers(token: string): Promise<Carrier[]> {
    const data = await this.http.get<{ data: Carrier[] }>('/admin/carriers?available=true', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  }

  async getAllRoutes(token: string): Promise<Route[]> {
    const data = await this.http.get<{ data: Route[] }>('/admin/routes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  }

  async assignShipment(token: string, shipmentId: number, payload: AssignShipmentPayload): Promise<void> {
    await this.http.patch(`/shipments/${shipmentId}/assign`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const adminService = new AdminService();
