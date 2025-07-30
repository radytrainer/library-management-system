module.exports = (sequelize, DataTypes) => {
    return sequelize.define('History', {
        status: DataTypes.STRING,
        change_date: DataTypes.DATE,
    });    
}