import { PartialType } from '@nestjs/swagger';
import { CreatePowerpointDto } from './create-powerpoint.dto';

export class UpdatePowerpointDto extends PartialType(CreatePowerpointDto) {}
