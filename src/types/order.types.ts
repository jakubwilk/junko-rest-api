export type TAddNewOrder = {
    employeeId: string;
    customerEmail: string;
    title: string;
    issueTime: Date;
    details: string;
};

export type TNewOrderData = {
    title: string;
    clientEmail: string;
    employeeId: string;
    issueTime: Date;
    created_at: Date;
    updated_at: Date;
    status: number;
    details: string;
};
