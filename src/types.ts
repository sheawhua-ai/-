/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OrderStatus = 
  | 'SHIPPED' 
  | 'AFTER_SALES_INITIATED' 
  | 'RETURNING' 
  | 'RECEIVED' 
  | 'COMPLETED';

export type AfterSalesType = 'REFUND_ONLY' | 'RETURN_AND_REFUND';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  productName: string;
  productImage: string;
  sku: string;
  price: number;
  quantity: number;
  status: OrderStatus;
  createTime: string;
  shippingTime: string;
  afterSalesType?: AfterSalesType;
  returnLogisticsNumber?: string;
  returnTime?: string;
  receiveTime?: string;
  completionTime?: string;
  vendorName: string;
  vendorId: string;
  agentName: string;
  agentId: string;
}

export type UserRole = 'SALES' | 'CUSTOMER' | 'WAREHOUSE';
