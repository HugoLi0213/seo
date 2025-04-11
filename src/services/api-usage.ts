/**
 * Represents the API usage information.
 */
export interface ApiUsageResult {
    /**
     * The amount of API used.
     */
    used: number;
    /**
     * The amount of API remaining.
     */
    remaining: number;
    /**
     * The days left in the month.
     */
    daysLeft: number;
}

/**
 * Asynchronously retrieves the API usage information.
 *
 * @returns A promise that resolves to an ApiUsageResult object containing the API usage information.
 */
export async function getApiUsage(): Promise<ApiUsageResult> {
    // TODO: Implement this by calling an external API.
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysLeft = lastDayOfMonth.getDate() - today.getDate();

    return {
        used: 150,
        remaining: 1000 - 150,
        daysLeft: daysLeft
    };
}
