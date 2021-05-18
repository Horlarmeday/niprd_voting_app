import sequelizePaginate from 'sequelize-paginate';

module.exports = (sequelize, DataTypes) => {
  const Voter = sequelize.define(
    'Voter',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {}
  );

  Voter.associate = ({ Vote }) => {
    // associations can be defined here
    Voter.hasMany(Vote, {
      foreignKey: 'voter_id',
    });
  };

  sequelizePaginate.paginate(Voter);
  return Voter;
};
