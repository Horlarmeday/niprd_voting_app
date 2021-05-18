import sequelizePaginate from 'sequelize-paginate';

module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define(
    'Position',
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
    },
    {}
  );

  Position.associate = ({ Candidate, Vote }) => {
    // associations can be defined here
    Position.hasMany(Candidate, {
      foreignKey: 'position_id',
      as: 'candidates',
    });

    Position.hasMany(Vote, {
      foreignKey: 'position_id',
    });
  };

  sequelizePaginate.paginate(Position);
  return Position;
};
