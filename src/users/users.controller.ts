import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
// import { JwtService } from '@nestjs/jwt';
import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  NotFoundException,
  Delete,
  Param,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService,
    /* private jwtService: JwtService, */) { }

  @Post('/add')
  async addUser(@Res() res, @Body() createUserDto: UserDto) {
    Logger.log('Add  User rest api ', 'UsersController');
    try {
      const user = await this.userService.addUser(createUserDto);
      return res.status(HttpStatus.OK).json({
        msg: 'User has been created successfully',
        /* user, */
      });
    } catch (e) {
      return res.status(HttpStatus.CONFLICT).json({
        msg: 'User already exists',
      });
    }
  }

  //@UseGuards(AuthGuard())
  @Get('/getbyId/:userID')
  async getUser(@Res() res, @Param('userID') userID) {
    Logger.log('GetUser Byid User rest api ', 'UsersController');
    const user = await this.userService.getUser(userID);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  }

  @Get('/secretForgotPassword/:email')
  async secretForgotPassword(@Res() res, @Param('email') email) {
    try {
      const user = await this.userService.secretForgotPassword(email);
      console.log(user);

      return res.json(user);
    } catch (e) {
      return res.json({
        error: true,
        message: e,
      });
    }
  }

  @Get('/validateForgotPassword/:email/:token')
  async validateForgotPassword(
    @Res() res,
    @Param('email') email,
    @Param('token') token,
  ) {
    try {
      await this.userService
        .validateForgotPassword(email, token)
        .then((valide) =>
          res.status(200).json({
            valide,
          }),
        );
    } catch (e) {
      return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
        error: true,
        message: e.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update/:userID')
  async updateUser(
    @Res() res,
    @Param('userID') userID,
    @Body() createUserDto: UserDto,
  ) {
    Logger.log('Update User rest api ', 'UsersController');
    const user = await this.userService.updateUser(userID, createUserDto);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      msg: 'User has been successfully updated', user
      /* data: this.createJwtPayload(user), */
    });
  }

  //@UseGuards(AuthGuard())
  @Delete('/delete/:userID')
  async deleteUser(@Res() res, @Param('userID') userID) {
    Logger.log('Delete user rest api ', 'UsersController');
    const user = await this.userService.deleteUser(userID);
    if (!user) throw new NotFoundException('User does not exist');
    return res.status(HttpStatus.OK).json({
      msg: 'User has been deleted',
      user,
    });
  }

  //@UseGuards(AuthGuard())
  @Get('/all')
  async getAllUser(@Res() res) {
    Logger.log('Get all users rest api ', 'UsersController');
    const users = await this.userService.getAllUser();
    return res.status(HttpStatus.OK).json(users);
  }

  @Get('/sendMail')
  async sendmail(@Res() res) {
    await this.userService.sendMail();

    return res.status(HttpStatus.OK).send('email sended !!');
  }


  @UseGuards(JwtAuthGuard)
  @Put('/changePassword')
  async changePassword(
    @Res() res,
    @Body() body: any,
  ) {
    console.log({body});
    
    await this.userService.changePassword(body.id, body.oldPassword, body.newPassword, body.confirmPassword)
      .then(user => {
        return res.status(HttpStatus.OK).json({
          codeMsg: 1,
          user: user
        })
      })
      .catch(() => {
        return res.status(HttpStatus.BAD_REQUEST).json({
          codeMsg: -1,
          message: 'erreur dans la récuperation de l\'utilisateur '
        })
      })
    /* Logger.log('Update User rest api ', 'UsersController');
    const user = await this.userService.changePassword(body.id, body.oldPassword, body.newPassword, body.comfirmPassword)
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      msg: 'User has been successfully updated', user
      
    }); */
  }
}
