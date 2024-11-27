import { PartialType } from '@nestjs/mapped-types';
import { DestDto } from './dest.dto';
import { CreateDestDto } from './create-dest.dto';

export class UpdateDestDto extends PartialType(CreateDestDto) {}
