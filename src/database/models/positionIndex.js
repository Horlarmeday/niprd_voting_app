module.exports = (sequelize, DataTypes) => {
  const Index = sequelize.define(
    'Index',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      voter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'positionindexes',
    }
  );

  Index.associate = ({ Voter }) => {
    // associations can be defined here
    Index.belongsTo(Voter, {
      foreignKey: 'voter_id',
    });
  };
  return Index;
};
