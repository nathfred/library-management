const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    memberCode: DataTypes.STRING,
    bookCode: DataTypes.STRING,
    borrowedDate: DataTypes.DATE,
    returnedDate: DataTypes.DATE,
    penalty: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
  }, {
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Member);
    Transaction.belongsTo(models.Book);
  };

  return Transaction;
};
