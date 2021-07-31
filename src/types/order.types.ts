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

export type TEditOrderData = {
    clientEmail: string;
    created_at: Date;
    details: string;
    employeeId: string;
    id: string;
    issueTime: Date;
    status: number;
    title: string;
    updated_at: Date;
};
