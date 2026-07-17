export interface Order {
    id: string;
    accountEmail: string;
    platformName: string;
    platformIcon: string;
    plan: string;
    profileAmount: number;
    buyDate: Date;
    finishDate: Date;
    paymentAmount: number;
    orderType: string
}

export interface OrderDetails {
    id: string;
    accountEmail: string;
    platformName: string;
    platformIcon: string;
    buyDate: Date;
    orderType: string
}

export interface OrderRegister {
    
}