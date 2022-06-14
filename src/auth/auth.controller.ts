import {
  Request,
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Logger,
  Get,
  UseGuards,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

//import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res) {
    Logger.log('Authentification controller', 'AuthController');
    const result = await this.authService.validateUserByPassword(loginUserDto);

    try {
      return res.json(result.data);
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ msg: result.msg });
    }
  }

  @Post('/add')
  async addUser(@Res() res, @Body() createUserDto: any) {
    Logger.log('Add  User rest api ', 'UsersController');
    try {
      const user = await this.authService.addUser(createUserDto);
      return res.status(HttpStatus.OK).json(user);
    } catch (e) {
      return res.status(HttpStatus.CONFLICT).json({
        msg: 'User already exists',
      });
    }
  }

  @Get('/verify/:token')
  async verify(@Res() res, @Param('token') token) {
    Logger.log('Add  User rest api ', 'UsersController');
    try {
      const user = await this.authService.verifyUser(token);
      return res.status(HttpStatus.OK).redirect('http://localhost:3000/DnDWeviooReact/verified');
    } catch (e) {
      return res.status(HttpStatus.CONFLICT).json({
        msg: 'User already exists',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/userInfo')
  async getUserInfo(@Body() req, @Res() res) {
    await this.authService.userInfo(req.id)
      .then(user => {
        return res.status(200).json({
          codeMsg: 1,
          user: user
        })
      })
      .catch(() => {
        return res.status(500).json({
          codeMsg: -1,
          message: 'erreur dans la récuperation de l\'utilisateur '
        })
      })
  }

  @UseGuards(JwtAuthGuard)
  @Get('/hello')
  async hello(@Res() res) {

    return res.send('hello world')
  }

  @Post('/resetPassword')
  async resetPassword(@Body() req, @Res() res) {
    await this.authService.resetPassword(req.email)
      .then(result => {
        return res.status(HttpStatus.OK).json({
          error: false,
          result
        })
      })
      .catch(() => {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: true
        })
      })
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/verifyToken')
  async verifyTokenToResetPassword(@Request() request, @Res() res, @Body() body) {
    if (!request.headers.authorization) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: true,
        message: 'Unauthorized'
      })
    }
    await this.authService.verifyTokenForResetPassword(request.headers.authorization.split(' ')[1], body)
      .then(result => {
        return res.status(HttpStatus.OK).json({
          error: false,
          etat: result
        })
      })
      .catch(() => {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: true,
          message: 'Unauthorized'
        })
      })
  }


}
