import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
    constructor(private _prisma: PrismaService) {}
}
