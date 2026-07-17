import { Payment } from "./payment.model"
import { Platform } from "./platform.model"

export interface Account {
    id: string;
    email: string;
    password: string;
    membershipBuyDate: Date;
    membershipExpireDate: Date;
    registeredAt: Date;
    platform: Platform;
    payment: Payment;
    status: string;
    freeTrial: boolean;
} 

export interface AccountDetails {
    id: string;
    email: string;
    platformName: string;
    status: string;
}

export interface AccountRegister {
    email: string;
    password: string;
    platform: string;
    payment: string;
}

export interface AccountUpdate {
    email: string;
    password: string;
    platform: string;
    payment: string;
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    DEACTIVE = 'DEACTIVE'
}