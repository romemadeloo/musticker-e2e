import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

import { adminBaseUrl, apiPath } from './env.js';

/**
 * Read-only views of the admin API, for asserting what an admin UI action actually changed.
 *
 * Built on the admin browser context's `request`, which shares that context's cookies, so no token
 * handling happens here. Every method is a GET: state changes in admin specs go through the UI,
 * because the UI is what is under test. Endpoints were read off the admin panel's own traffic on
 * development-static, 2026-09-25.
 */

export type AdminStatus = { id: number; code?: string; name: string; translated?: string };

export type AdminOrderSummary = {
  id: number;
  order_number: string;
  items_count: number;
  customer_details: { email: string; contact_name: string };
  order_status: AdminStatus;
  item_status: AdminStatus;
  payment_status: AdminStatus;
  payment_summary: { total_cost: number; payment_method_name: string };
};

export type AdminOrderItem = {
  order_id: number;
  order_item_id: number;
  cart_item_id: number;
  quantity: number;
  cost: number;
  product: { name: string; code: string; translated: string };
  size: { width: string; height: string };
  artwork: unknown;
  proof: unknown;
  status: AdminStatus;
};

export type AdminActivityEntry = {
  type: string;
  event: string | null;
  created_at: string;
  message: { source?: string; content?: string } | null;
  file_name: string | null;
  item_status: AdminStatus & { code: string };
  user: { name: string; email: string; is_admin: boolean } | null;
};

export type AdminTracking = { tracking_number: string; tracking_status: string; courier_name: string };

// Order-level codes (orders/admin/order-tabs). PA is a list tab, not a status an order can hold.
export const orderStatusCodes = ['BP', 'FP', 'SP', 'CP', 'CC', 'PA'] as const;

type Envelope<T> = { success: boolean; message?: string; data: T };

export class AdminApi {
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Finds an order by its number. The list endpoint only searches within one tab, so each tab is
   * tried in turn -- an order under test can be in any of them by the time this is called.
   */
  async findOrder(orderNumber: string): Promise<AdminOrderSummary> {
    for (const tab of orderStatusCodes) {
      const page = await this.get<{ data?: AdminOrderSummary[] } | AdminOrderSummary[]>(
        `/sys/kr/orders/admin/list?order_date&search_key=${encodeURIComponent(orderNumber)}&page=1&order_tab=${tab}&sort_column&sort_direction`
      );
      const rows = Array.isArray(page) ? page : (page.data ?? []);
      const match = rows.find((row) => row.order_number === orderNumber);

      if (match) {
        return match;
      }
    }

    throw new Error(`Admin order list has no order ${orderNumber} in any tab (${orderStatusCodes.join(', ')}).`);
  }

  async orderStatus(orderId: number): Promise<AdminStatus> {
    const details = await this.get<{ order_status: AdminStatus }>(`/sys/kr/orders/admin/details/${orderId}`);
    return details.order_status;
  }

  items(orderId: number): Promise<AdminOrderItem[]> {
    return this.get(`/sys/kr/order/items/${orderId}`);
  }

  /** Newest first. Keyed by the item's cart_item_id, not its order_item_id. */
  async activity(cartItemId: number): Promise<AdminActivityEntry[]> {
    const data = await this.get<{ entries: AdminActivityEntry[] }>(`/sys/kr/orders/artwork/activity/${cartItemId}`);
    return data.entries;
  }

  tracking(orderId: number): Promise<AdminTracking[]> {
    return this.get(`/sys/kr/tracking/shipment/track/get/${orderId}`);
  }

  /** Polls until the order's single item reports `code`, since several transitions land async. */
  async expectItemStatus(orderId: number, code: string): Promise<AdminActivityEntry> {
    let latest: AdminActivityEntry | undefined;

    await expect
      .poll(
        async () => {
          const [item] = await this.items(orderId);
          [latest] = await this.activity(item.cart_item_id);
          return latest?.item_status.code;
        },
        { timeout: 20_000, message: `order ${orderId}'s item never reached status ${code}` }
      )
      .toBe(code);

    return latest!;
  }

  async expectOrderStatus(orderId: number, code: string): Promise<void> {
    await expect
      .poll(async () => (await this.orderStatus(orderId)).code, {
        timeout: 20_000,
        message: `order ${orderId} never reached order status ${code}`
      })
      .toBe(code);
  }

  private async get<T>(path: string): Promise<T> {
    const origin = adminBaseUrl();
    const response = await this.request.get(apiPath(path), {
      headers: origin ? { origin, referer: `${origin}/` } : {}
    });

    expect(response.ok(), `GET ${path} answered HTTP ${response.status()}`).toBe(true);
    const body = (await response.json()) as Envelope<T>;
    expect(body.success, `GET ${path} answered success=false: ${body.message ?? ''}`).toBe(true);

    return body.data;
  }
}
