import sequelizePaginate from 'sequelize-paginate';

module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define(
    'Candidate',
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
      position_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {}
  );

  Candidate.associate = ({ Position, Vote }) => {
    // associations can be defined here
    Candidate.belongsTo(Position, {
      foreignKey: 'position_id',
      as: 'position',
    });

    Candidate.hasMany(Vote, {
      foreignKey: 'candidate_id',
    });
  };

  sequelizePaginate.paginate(Candidate);
  return Candidate;
};
