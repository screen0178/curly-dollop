import { PartialType } from '@nestjs/mapped-types';
import { CreateArusKaDto } from './create-arus-ka.dto';

export class UpdateArusKaDto extends PartialType(CreateArusKaDto) {}
