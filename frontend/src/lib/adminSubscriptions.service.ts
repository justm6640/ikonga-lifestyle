import { fetchAPI } from './api';

export interface AssignSubscriptionPayload {
    userId: string;
    type: 'STANDARD6' | 'STANDARD12' | 'STANDARD24' | 'STANDARD48' | 'VIP12' | 'VIPPP16';
    startDate: string; // ISO format YYYY-MM-DD (endDate auto-calculated by backend)
}

export const adminSubscriptionsService = {
    /**
     * Assign a subscription to a user (ADMIN only)
     */
    async assignSubscriptionToUser(payload: AssignSubscriptionPayload) {
        return await fetchAPI('/admin/subscriptions/assign', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    /**
     * Get all subscriptions for a specific user
     */
    async getUserSubscriptions(userId: string) {
        return await fetchAPI(`/admin/subscriptions/users/${userId}`);
    },

    /**
     * Delete a subscription
     */
    async deleteSubscription(subscriptionId: string) {
        return await fetchAPI(`/admin/subscriptions/${subscriptionId}`, {
            method: 'DELETE',
        });
    },
};
