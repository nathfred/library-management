module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define('Member', {
        code: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        isPenalized: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Default value indicating not penalized
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    });

    Member.associate = (models) => {
        Member.hasMany(models.Transaction);
    };

    return Member;
};
