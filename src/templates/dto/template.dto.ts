import { UserDto } from 'src/users/dto/user.dto';
export class TemplateDto {
  readonly name: string;
  readonly nbreofuses: number;
  readonly version: number;
  readonly userId: UserDto;
}
