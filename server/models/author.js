module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Author', {
        name: DataTypes.STRING,
        biography: DataTypes.TEXT,
        birth_date: DataTypes.DATE,
        nationality: DataTypes.STRING,
        profile_image: DataTypes.STRING,
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    });
};