import sequelizePaginate from 'sequelize-paginate';
import bcrypt from 'bcryptjs';

import { sign } from 'jsonwebtoken';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
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
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      hooks: {
        // eslint-disable-next-line no-unused-vars
        async beforeCreate(user, options) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        },
      },
    },
    {}
  );

  User.prototype.generateAuthToken = function() {
    return sign(
      {
        sub: this.id,
        name: this.name,
        phone: this.phone,
      },
      process.env.JWT_SECRET
    );
  };

  User.associate = ({}) => {
    // associations can be defined here
  };
  sequelizePaginate.paginate(User);
  return User;
};
