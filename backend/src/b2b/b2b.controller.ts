import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { B2bService } from './b2b.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { RespondRfqDto } from './dto/respond-rfq.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('B2B')
@Controller('b2b')
export class B2bController {
  constructor(private b2bService: B2bService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('rfqs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new RFQ' })
  createRfq(@Request() req: any, @Body() dto: CreateRfqDto) {
    return this.b2bService.createRfq(req.user.id, dto);
  }

  @Public()
  @Get('rfqs')
  @ApiOperation({ summary: 'List all RFQs' })
  findAllRfqs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.b2bService.findAllRfqs({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      status,
      category,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('rfqs/my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my RFQs' })
  getMyRfqs(@Request() req: any) {
    return this.b2bService.findMyRfqs(req.user.id);
  }

  @Public()
  @Get('rfqs/:id')
  @ApiOperation({ summary: 'Get RFQ by ID' })
  findRfqById(@Param('id') id: string) {
    return this.b2bService.findRfqById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('rfqs/:id/respond')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respond to an RFQ' })
  respondToRfq(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: RespondRfqDto,
  ) {
    return this.b2bService.respondToRfq(id, req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('rfqs/:rfqId/accept/:responseId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept an RFQ response' })
  acceptResponse(
    @Param('rfqId') rfqId: string,
    @Param('responseId') responseId: string,
    @Request() req: any,
  ) {
    return this.b2bService.acceptResponse(rfqId, responseId, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('rfqs/:id/close')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Close an RFQ' })
  closeRfq(@Param('id') id: string, @Request() req: any) {
    return this.b2bService.closeRfq(id, req.user.id);
  }
}
