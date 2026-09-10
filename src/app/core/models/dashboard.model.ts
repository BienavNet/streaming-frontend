export interface DashboardData {
    totalAccounts: number,
    totalOrders: number,
    totalPlatforms: number,
    totalOrderMoney: number,
    accountsByPlatform: Array<AccountsByPlatform>,
    membershipNearToExpire: Array<MembershipNearToExpire>,
    ordersNearToExpireQuery: Array<OrdersNearToExpireQuery>
}

interface MembershipNearToExpire {
    email: string,
    membershipExpireDate: Date,
    isFreeTrial: boolean,
    platform: string
}

interface AccountsByPlatform {
    name: string,
    quantity: number
}

interface OrdersNearToExpireQuery {
    id: string,
    accountEmail: string,
    platformName: string,
    planName: string,
    profileAmount: number,
    buyDate: Date,
    finishDate: Date,
    paymentAmount: number,
    orderType: string
}