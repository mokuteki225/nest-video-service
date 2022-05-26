import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';

/**
 * Temp controller which is being used for testing purposes
 */
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
}
