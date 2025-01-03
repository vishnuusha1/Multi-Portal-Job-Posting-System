const logger = require("@logger");



/**
 * Creates a service for CRUD operations on a given model.
 * @param {Model} model - The Sequelize model to perform operations on.
 * @returns {Object} - An object containing functions for create, update, delete, findByPk, findOne, and findAndCount.
 * @example
 * const userService = baseService(User);
 */
const baseService=(model)=>{
return{
    create:async(data)=>{
        try {
            return await model.create(data);
          } catch (error) {
            logger.error(error.message)
            throw error;
          }
    },
    update:async(data,where)=>{
        try {
            return await model.update(data, { where: where ,returning: true});
         } catch (error) {
            logger.error(error.message)
            throw error;
          }
    },
    delete:async(where)=>{
        try {
            return await model.destroy({where:where});
          } catch (error) {
            logger.error(error.message)
            throw error;
          }
    },
    findByPk:async(id)=>{
        try {
            return await model.findByPk(id);
          } catch (error) {
            logger.error(error.message)
            throw error;
          }
    },
    findOne:async(data)=>{
        try {
            return await model.findOne(data);
          } catch (error) {
            logger.error(error.message)
            throw error;
          }
    },
    findAndCount:async(data)=>{
        try {
            return await model.findAndCountAll(data);
          } catch (error) {
            logger.error(error.message)
            throw error;
          }
    },
    count : async (data) => {
        try {
            return await model.count(data);
          } catch (error) {
            logger.error(error.message)
            throw error;
          }
    }
}
}                   
module.exports=baseService