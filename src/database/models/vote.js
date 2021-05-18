import sequelizePaginate from 'sequelize-paginate';

module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define(
    'Vote',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      position_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      candidate_id: {
        type: DataTypes.INTEGER,
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

  Vote.associate = ({ Candidate, Position, Voter }) => {
    // associations can be defined here
    Vote.belongsTo(Candidate, {
      foreignKey: 'candidate_id',
      as: 'candidate',
    });

    Vote.belongsTo(Position, {
      foreignKey: 'position_id',
      as: 'position',
    });

    Vote.belongsTo(Voter, {
      foreignKey: 'voter_id',
      as: 'voter',
    });
  };

  sequelizePaginate.paginate(Vote);
  return Vote;
};
