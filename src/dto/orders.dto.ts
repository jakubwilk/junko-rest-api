class OrderEmployeesDto {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
}

class OrderOrdersListDto {
    readonly client: string;
    readonly startDate: Date;
    readonly modifyDate: Date;
    employee: string;
    readonly status: number;
}
