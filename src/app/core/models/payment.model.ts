export interface Payment {
    id: string;
    card: string;
    bankName: string;
}

export interface PaymentRegister {
    number: string,
    month: string,
    year: string,
    cvv: string,
    bankName: string
}