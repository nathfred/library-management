module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  });

  Book.associate = (models) => {
    Book.hasMany(models.Transaction);
  };

  return Book;
};
