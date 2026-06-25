import { httpClient } from './http/FetchHttpClient';
import type { IHttpClient } from './http/IHttpClient';
import type { Shipment, ShipmentStatus } from '../types/shipment';
import type { Carrier, Route, AssignShipmentPayload, CreateCarrierPayload } from '../types/admin';

export class AdminService {
  constructor(private readonly http: IHttpClient = httpClient) {}

  async getAllShipments(token: string, status?: ShipmentStatus): Promise<Shipment[]> {
    const path = status ? `/shipments?status=${status}` : '/shipments';
    const data = await this.http.get<{ data: Shipment[] }>(path, {
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

  async getAllCarriers(token: string): Promise<Carrier[]> {
    const data = await this.http.get<{ data: Carrier[] }>('/admin/carriers', {
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

  async createCarrier(token: string, payload: CreateCarrierPayload): Promise<Carrier> {
    const data = await this.http.post<{ data: Carrier }>('/admin/carriers', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  }
}

export const adminService = new AdminService();
