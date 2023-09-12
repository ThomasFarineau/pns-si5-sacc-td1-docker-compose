'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Visit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Visit.init({
    ip: DataTypes.STRING,
    date: DataTypes.DATE,
    url: DataTypes.STRING,
    agent: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Visit',
  });
  return Visit;
};