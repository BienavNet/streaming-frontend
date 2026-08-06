import { Plan } from "./plan.model"

export interface MembershipDetails {
    id: string;
    details: Plan;
    isFreeTrial: boolean;
    membershipBuyDate: Date;
    membershipExpireDate: Date;
}

export interface RegisterMembership {
    account: string;
    membershipConfig: string;
    isFreeTrial: boolean;
    membershipBuyDate: Date;
    membershipExpireDate: Date;
}