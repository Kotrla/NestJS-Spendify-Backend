import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/services/prisma.service';

@Injectable()
export class InvestmentsService {
	constructor(private prisma: PrismaService) {}
}
