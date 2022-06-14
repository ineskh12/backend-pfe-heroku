import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as speakeasy from "speakeasy";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  async userInfo(id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.usersService.findOneByID(id)
        .then(user => {
          // let u = delete user.secretcode
          resolve(user)
        })
        .catch(() => reject('erreur dans la récuperation de l\'utilisateur'));

    })
    // await this.usersService.findOneByID(id)
    //   .then(res => {

    //     //console.log(res);
    //     return res
    //   })
    //   .catch(err => err)
  }

  // CREATE user
  async addUser(createUserDTO: any): Promise<any> {
    const newUser = await this.usersService.add(createUserDTO);

    return this.createJwtPayload(newUser);
  }

  async validateUserByPassword(loginAttempt: LoginUserDto): Promise<any> {
    let userToAttempt: any = await this.usersService.findOneByEmail(
      loginAttempt.email,
    );

    return new Promise((resolve, reject) => {
      if (!userToAttempt) {
        reject({ success: false, msg: 'User not found' });
      }

      if (userToAttempt.status) {
        userToAttempt.checkPassword(loginAttempt.password, (err, isMatch) => {
          if (err)
            reject({
              success: false,
              msg: 'Unexpected error. Please try again later.',
            });

          if (isMatch) {
            resolve({
              success: true,
              data: this.createJwtPayload(userToAttempt),
            });
          } else {
            reject({ success: false, msg: 'Wrong password' });
          }
        });
      } else {
        userToAttempt.checkPassword(loginAttempt.password, (err, isMatch) => {
          if (err)
            reject({
              success: false,
              msg: 'Unexpected error. Please try again later.',
            });

          if (isMatch) {
            let token = this.createJwtPayload(userToAttempt)
            this.mailerService
              .sendMail({
                to: userToAttempt.email, // list of receivers
                from: 'ali.obba@esprit.tn', // sender address
                subject: 'Vérification compte', // Subject line
                text: 'http://localhost:3002/auth/verify/' + token.access_token, // plaintext body
                // html: '<b>welcome</b>', // HTML body content
              })
            resolve({
              success: true,
              data: this.createJwtPayload(userToAttempt),
            });
          } else {
            reject({ success: false, msg: 'Wrong password' });
          }
        });
        // this.mailerService
        //   .sendMail({
        //     to: 'ines.khelifi.1@esprit.tn', // list of receivers
        //     from: 'ali.obba@esprit.tn', // sender address
        //     subject: 'Testing Nest MailerModule ✔', // Subject line
        //     text: 'welcome', // plaintext body
        //     html: '<b>welcome</b>', // HTML body content
        //   })
        //   .then(() => { })
        //   .catch(() => { });
        // reject({ success: false, msg: 'Votre compte n\'est pas encore verifié' });
      }
    });
  }

  async verifyUser(token: any): Promise<any> {
    const user = await this.jwtService.verify(token);
    console.log(user.id);

    return new Promise((resolve, reject) => {
      if (user) {
        this.usersService.updateUser(user.id, { status: true })
          .then(() => {
            resolve('yesss')
          })
          .catch(() => {

            reject('noooo')
          })
      }
      else
        reject('noooo')
    })
  }

  async resetPassword(email: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.usersService.findOneByEmailWithoutPassword(email)
        .then(async (user) => {
          const u = await this.jwtService.sign({ _id: user._id }, {
            expiresIn: '1d'
          })

          this.mailerService
            .sendMail({
              to: user.email, // list of receivers
              from: 'ali.obba@esprit.tn', // sender address
              subject: 'Réinitialiser Mot de passe', // Subject line
              //text: 'Pour réinitialiser votre mot de passe veuillez accéder à ce lien : http://localhost:3000/DnDWeviooReact/resetPassword/' + u, // plaintext body
              html: `<div>
                        <h1> DnD Wevioo </h1>
                        <h2> Pour réinitialiser votre mot de passe veuillez accéder au lien ci-dessous </h2>
                        <a style="
                          background-color: #199319;
                          color: white;
                          padding: 25px 25px;
                          text-decoration: none; "
                         href="http://localhost:3000/DnDWeviooReact/reset/${u}">
                          Réinitialiser Mot de passe
                        </a>
                      </div>
                        `, // HTML body content
            })

          resolve({
            reset_token: u,
            //secret: secret.base32,
            //user
          })
        })
        .catch(err => {
          reject()
        })
    })
  }

  async verifyTokenForResetPassword(token, body): Promise<any> {
    return new Promise(async (resolve, reject) => {

      try {
        let user = await this.jwtService.verify(token);
        console.log({ user });

        this.usersService.resetPassword(user._id, body.password, body.confirmPassword)
          .then(() => {
            resolve(true)
          })
          .catch(() => {
            reject(false)
          })
      } catch (error) {
        reject(false)
      }

      /* console.log('user');
      
      if (!user) {
        
      } */



    })
  }

  createJwtPayload(user) {
    const data = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(data),
      expiresIn: 3600,
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.getUser(payload.id);
  }
}
