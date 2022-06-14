import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './interfaces/template.interface';

import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel('Template') private readonly templateModel: Model<Template>,
  ) { }
  private products: Template[] = [];
  /* 
      async insertTemplate(name: string,gridId: Grid,userId:User): Promise<Template> {
        const addedTemplate =  new this.templateModel({
          name,
       
          gridId,userId
        });
        const result = await addedTemplate.save();
        return result;
     } */

  /*  async getTemplates() {
      const templates = await (await this.templateModel.find().sort({name:'asc'}).exec());
      return templates.map(temp => ({
        id: temp.id,
        name: temp.name,
        gridId:temp.gridId,
        userId:temp.userId
       
        
      
      }));
    } */

  async testaddtemp(name, editor, layout, userId) {
    try {
      console.log({ editor });

      const addedTemplate = new this.templateModel({
        name: name,
        editor: editor,
        layout: layout,
        userId: userId,
      });

      const result = await addedTemplate.save();
      console.log(result);
    } catch (e) {
      console.log('template erreur');
    }
  }

  async getTemplates(iduser) {
    const template = await this.templateModel
      .find({ userId: iduser })
      .sort({ updatedAt: '-1' })
      .populate('gridId')
      .populate({
        path: 'gridId',
        populate: { path: 'items' },
      })
      .exec();
    return template;
  }

  async findById(id): Promise<any> {
    const template = await this.templateModel
      .find({ _id: id })
      .populate('gridId')
      .populate({
        path: 'gridId',
        populate: { path: 'items' },
      })
      .exec();
    return template;
  }

  async findByUserId(userId): Promise<any> {
    console.log(userId);

    const template = await this.templateModel
      .find({ userId: userId })
      .populate('gridId')
      .populate({
        path: 'gridId',
        populate: { path: 'items' },
      })
      .exec();
    return template;
  }

  async SortByTempName(userId): Promise<any> {
    console.log(userId);

    const template = await this.templateModel
      .find({ userId: userId })
      .populate('gridId')
      .populate({
        path: 'gridId',
        populate: { path: 'items' },
      })
      .sort({ name: 'asc' })
      .exec();
    return template;
  }

  async SortAsc(userId): Promise<any> {
    console.log(userId);

    const template = await this.templateModel
      .find({ userId: userId })
      .populate('gridId')
      .populate({
        path: 'gridId',
        populate: { path: 'items' },
      })
      .sort({ nbreofuses: 'asc' })
      .exec();
    return template;
  }
  async SortDsc(userId): Promise<any> {
    console.log(userId);

    const template = await this.templateModel
      .find({ userId: userId })
      .populate('gridId')
      .populate({
        path: 'gridId',
        populate: { path: 'items' },
      })
      .sort({ nbreofuses: 'desc' })
      .exec();
    return template;
  }

  async SortDate(userId): Promise<any> {
    console.log(userId);

    const template = await this.templateModel
      .find({ userId: userId })
      .populate('gridId')
      .populate({
        path: 'gridId',
        populate: { path: 'items' },
      })
      .sort({ createdAt: 1 })
      .exec();
    return template;
  }

  /* 
          deleteTemplate = async (id) => new Promise((resolve, reject) => {
            this.templateModel
            .findById(id).populate('gridId').populate({
              path : 'gridId',
              populate: { path: 'items'}
            })
            .exec()
            .then(
              (template) => {

                if(template){
                
                  for (let i = 0; i < template.gridId.items.length; i++) {
                    const element = template.gridId.items[i];

                    this.itemModel.findByIdAndDelete(element._id).exec()
                    console.log('items is here');
                    
                  }
                  this.gridModel.findByIdAndDelete(template.gridId._id).exec()

                  return template.save()
                          .then(
                            () => 
                            {
                              template.delete();
                              resolve(template);
                              
                              //return template;
                            }
                
                          )
                          .catch(
                            (e) => reject(e)
                            // {return e}
                            
                          );

                        }
                        return reject('Template inexistant !!');
              }
            )
            .catch(
              (e) => reject(e.message)
            )
          });
        

  */
  async deleteUser(userID): Promise<any> {
    const deletedUser = await this.templateModel.findByIdAndRemove(userID);
    return deletedUser;
  }

  getPagesTemplate = async (filter, page, count) =>
    new Promise((resolve, reject) => {
      const pageNumber = page > 0 ? parseInt(page, 10) - 1 : 0;
      const countNumber = count ? parseInt(count, 10) : 10;
      return this.templateModel
        .find(filter)
        .skip(pageNumber * countNumber)
        .limit(countNumber)
        .populate('gridId')
        .populate({
          path: 'gridId',
          populate: { path: 'items' },
        })
        .then((template) => resolve(template))
        .catch((error) => reject(error));
    });

  getById = (id) =>
    new Promise((resolve, reject) => {
      try {
        return this.templateModel
          .findOne({ _id: id })
          .populate('gridId')
          .populate({
            path: 'gridId',
            populate: { path: 'items' },
          })
          .then((demande) =>
            demande
              ? resolve(demande)
              : reject('There is no Demande registered with the provided id.'),
          )
          .catch((error) => reject(error));
      } catch (err) {
        return reject(err);
      }
    });

  async updateTemplate(body: any): Promise<any> {

    return new Promise((resolve, reject) => {

      this.templateModel.updateOne({ _id: body._id }, body)
        .then(() => {
          resolve(body)
        })
        .catch((err) => {

          reject(err)
        })
    })
  }

  /*  updateTemplate = async (id,name,items) => new Promise((resolve, reject) => {
              this.templateModel.findById(id).populate('gridId').populate({
                path : 'gridId',
                 populate: { path: 'items'}
                })
                .then(
                  (template) => {
                    if(template){
                      //let t: Template;
                      let t = {...template};
                    
                    if(name !== undefined){
                      t.name = name;
                    }
                    if(items !== undefined){
                      
                        items.forEach(item => {

                          for (let i = 0; i < t.gridId.items.length; i++) {
                            const element = t.gridId.items[i];

                                if(element._id === item._id){
                                  if(element !== item){
                                    this.itemModel.findByIdAndUpdate({_id : item._id},item,null,(err,doc) => {
                                      if (err){ 
                                        console.log(err); 
                                      } 
                                      else{ 
                                        console.log("Updated item : ", doc); 
                                      }
                                    })
                                  }
                                }else if(i === t.gridId.items.length - 1 && element._id !== item._id){
                                  t.gridId.items.push(item)
                                }

                          }

                        });
                      
                    }

                    return t.save().then(
                      (demandeObject) => resolve(demandeObject),
                  )
                  .catch(
                      (e) => reject(e),
                  );
                }

                return reject('Aucune Template trouvé ! ')
                  }
                )
                .catch(
                  (e) => reject(e)
                )

               return template.save().then(
                (demandeObject) => resolve(demandeObject),
            )
            .catch(
                (e) => reject(e),
            );
             
            });
 */
}
