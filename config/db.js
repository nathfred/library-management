const Sequelize = require('sequelize');
const config = require('./config.json')['development']; // Adjust for the appropriate environment
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const Member = require('../models/member')(sequelize, Sequelize);
const Book = require('../models/book')(sequelize, Sequelize);
const Transaction = require('../models/transaction')(sequelize, Sequelize);

module.exports = {
    sequelize,
    Member,
    Book,
    Transaction,
};
