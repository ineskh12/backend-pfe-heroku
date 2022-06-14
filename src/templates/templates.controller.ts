import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  HttpStatus,
  Logger,
  HttpException,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { User } from 'src/users/interfaces/user.interface';
import { TemplateDto } from './dto/template.dto';
import { Template } from './interfaces/template.interface';
import { TemplatesService } from './templates.service';
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) { }

  @Post('/ajouter')
  async ajoutTemplate(
    @Res() res,
    @Body('name') name: string,
    @Body('editor') editor,
    @Body('layout') layout,
    @Body('userId') userId: User,
  ) {
    try {
      const template = await this.templatesService.testaddtemp(
        name,
        editor,
        layout,
        userId,
      );

      return res.status(HttpStatus.OK).json({ message: "template create successfully" });
    } catch (e) {
      return res.send(e);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all/:userID')
  async getAllTemplates(@Res() res, @Param('userID') iduser) {
    Logger.log('Get all rest api ', 'TemplatesController');
    const templates = await this.templatesService.getTemplates(iduser);

    return res.status(HttpStatus.OK).json(templates);
  }
  @Get('/getBy/:tempID')
  async findById(@Res() res, @Param('tempID') tempID: string) {
    Logger.log('getById rest api', 'TemplatesController');
    const templates = await this.templatesService.findById(tempID);

    return res.status(HttpStatus.OK).json(templates);
  }

  @Get('/getByUser/:userID')
  async findByUserId(@Res() res, @Param('userID') userID) {
    Logger.log('getByUserId rest api', 'TemplatesController');
    const templates = await this.templatesService.findByUserId(userID);

    return res.status(HttpStatus.OK).json(templates);
  }
  @Get('/sortbyname/:userID')
  async sortByTemp(@Res() res, @Param('userID') userID: string) {
    Logger.log('getByUserId rest api', 'TemplatesController');
    const templates = await this.templatesService.SortByTempName(userID);

    return res.status(HttpStatus.OK).json(templates);
  }
  @Get('/sortasc/:userID')
  async sortAsc(@Res() res, @Param('userID') userID: string) {
    Logger.log('getByUserId rest api', 'TemplatesController');
    const templates = await this.templatesService.SortAsc(userID);

    return res.status(HttpStatus.OK).json(templates);
  }
  @Get('/sortdesc/:userID')
  async sortDesc(@Res() res, @Param('userID') userID: string) {
    Logger.log('getByUserId rest api', 'TemplatesController');
    const templates = await this.templatesService.SortDsc(userID);

    return res.status(HttpStatus.OK).json(templates);
  }
  @Get('/sortdesc/:userID')
  async sortDate(@Res() res, @Param('userID') userID: string) {
    Logger.log('getByUserId rest api', 'TemplatesController');
    const templates = await this.templatesService.SortDate(userID);

    return res.status(HttpStatus.OK).json(templates);
  }

  @Delete('/delete')
  async deleteTemplate(@Res() res, @Body('id') id) {
    try {
      console.log(id);
      
      const deletedTemplate = await this.templatesService.deleteUser(id);

      return res.status(HttpStatus.OK).json({
        message: 'Template has been deleted!',
        post: deletedTemplate,
      });
    } catch (e) {
      return res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
        error: true,
        message: e,
      });
    }
  }
  @Put('/update')
  updateProduct(@Body() body, @Res() res) {
    this.templatesService.updateTemplate(body)
      .then(resultat => {
        return res.status(200).json({
          error: false,
          resultat
        })
      })
      .catch(e => res.status(e.code >= 100 && e.code <= 600 ? e.code : 500).json({
        error: true,
        message: e,
      }))
  }

  @Get('/list/:page/:count')
  async listTemplateByP(
    @Res() res,
    @Param('page') page: string,
    @Param('count') count: string,
  ) {
    Logger.log('getByUserId rest api', 'TemplatesController');
    const templates = await this.templatesService.getPagesTemplate(
      {},
      page,
      count,
    );

    return res.status(HttpStatus.OK).json(templates);
  }
}
