export interface Plan {
    id: string;
    platform: string;
    plan: string;
    profiles: number;
}

export interface PlanRegisterModel {
    platform: string;
    plan: string;
    profiles: number;
}