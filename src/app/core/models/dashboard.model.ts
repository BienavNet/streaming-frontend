export interface DashboardData {
    totalAccounts: number,
    totalOrders: number,
    totalPlatforms: number,
    totalOrderMoney: number,
    accountsByPlatform: Array<AccountsByPlatform>,
    membershipNearToExpire: Array<MembershipNearToExpire>
}

interface MembershipNearToExpire {
    email: string,
    membershipExpireDate: Date,
    isFreeTrial: boolean
}

interface AccountsByPlatform {
    name: string,
    quantity: number
}