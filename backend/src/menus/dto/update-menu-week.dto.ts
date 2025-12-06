
import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuWeekDto } from './create-menu-week.dto';

export class UpdateMenuWeekDto extends PartialType(CreateMenuWeekDto) { }
