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

export type TAddOrderHistoryData = {
    id: string;
    title: string;
    description: string;
    time: Date;
};

export type TAddOrderHistoryDataDb = {
    order_id: string;
    title: string;
    description: string;
    created_at: Date;
    updated_at: Date;
};

export type TOrderHistoryData = {
    id: string;
    order_id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
    description: string;
};
