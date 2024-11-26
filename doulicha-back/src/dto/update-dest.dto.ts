import { PartialType } from '@nestjs/mapped-types';
import { DestDto } from './dest.dto';

export class UpdateDestDto extends PartialType(DestDto) {}
