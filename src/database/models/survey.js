import sequelizePaginate from 'sequelize-paginate';

module.exports = (sequelize, DataTypes) => {
  const Survey = sequelize.define(
    'Survey',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      response: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      voter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {}
  );

  Survey.associate = ({ Voter }) => {
    // associations can be defined here
    Survey.belongsTo(Voter, {
      foreignKey: 'voter_id',
      as: 'voter',
    });
  };

  sequelizePaginate.paginate(Survey);
  return Survey;
};
