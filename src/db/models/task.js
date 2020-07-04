'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 999999
    },
  
  }, {
      tableName: 'task'
  });
    Task.associate = function(models,User) {
    User.belongsTo(models.Task,{
      as: 'creator',
      foreignKey: 'creatorId'
      
    })
  
    User.belongsTo(models.Task,{
      as: 'assignedTo',
      foreignKey: 'assignedToId'
    })

    User.belongsTo(models.Task,{
      as: 'project',
      foreignKey: 'projectId'
    })
  };
  return Task;
};