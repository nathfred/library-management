const { Member } = require('../models');
const { Book } = require('../models');
const { Transaction } = require('../models');

const Sequelize = require('sequelize');

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMemberByCode = async (req, res) => {
  const memberCode = req.query.memberCode;

  try {
    const member = await Member.findByPk(memberCode);
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const memberCode = req.body.memberCode;
    const bookCode = req.body.bookCode;

    // Check if the member exists and is not penalized
    const member = await Member.findOne({ where: { code: memberCode, isPenalized: false } });
    if (!member) {
      throw new Error('Member not found or penalized.');
    }

    // Check if the member has not borrowed more than 2 books
    const borrowedBooksCount = await Transaction.count({ where: { memberCode, returnedDate: null } });
    if (borrowedBooksCount >= 2) {
      throw new Error('Member has already borrowed the maximum allowed books.');
    }

    // Check if the book is available for borrowing
    const book = await Book.findOne({ where: { code: bookCode, stock: { [Sequelize.Op.gt]: 1 } } });
    if (!book) {
      throw new Error('Book not available for borrowing or no stock is available at the moment.');
    }

    // Create a transaction record indicating the member borrowed the book
    const transaction = await Transaction.create({ memberCode, bookCode, borrowedDate: new Date(), penalty: false, updatedAt: null });

    // Update book stock
    await Book.update({ stock: book.stock - 1 }, { where: { code: bookCode } });

    res.json({
      "success": true,
      "message": "Book borrowed successfully",
      "transactionId": transaction.id
    });
  } catch (error) {
    res.status(400).json({
      "success": false,
      "message": error.message,
    });
  }
};

const returnBook = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    const memberCode = req.body.memberCode;    

    // Check if the transaction exists and corresponds to the member
    const transaction = await Transaction.findOne({
      where: { id: transactionId, memberCode: memberCode, returnedDate: null },
    });
    if (!transaction) {
      throw new Error('Transaction not found or book already returned.');
    }

    // Calculate if the book is returned after more than 7 days
    const borrowedDate = new Date(transaction.borrowedDate);
    const returnDate = new Date();
    const daysDifference = (returnDate - borrowedDate) / (1000 * 3600 * 24);
    const isLateReturn = daysDifference > 7;

    // If returned after 7 days, apply a penalty and update member's penalty status
    if (isLateReturn) {
      await Member.update({ isPenalized: true }, { where: { code: memberCode } });
    }

    // Update the transaction record with the return date and penalty status
    await Transaction.update(
      { returnedDate: returnDate, penalty: isLateReturn, updatedAt: new Date() },
      { where: { id: transactionId } }
    );

    // Update book stock
    await Book.increment('stock', { by: 1, where: { code: transaction.bookCode } });

    res.json({
      "success": true,
      "message": "Book returned successfully.",
      "transactionId": transaction.id
    });
  } catch (error) {
    res.status(400).json({
      "success": false,
      "message": error.message,
    });
  }
};

const getAllAvailableBooks = async (req, res) => {
  try {
    // Retrieve all books and their quantities
    const books = await Book.findAll();

    // Exclude books that are currently borrowed
    const availableBooks = books.filter((book) => book.stock > 0);

    res.json({
      "success": true,
      "message": "Successfully get all available books.",
      "availableBooks": availableBooks,
    });
  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": error.message,
    });
  }
};

const getBorrowedBooksByMembers = async (req, res) => {
  try {
    const members = await Member.findAll();
    const borrowedBooksByMembers = [];

    // For each member, count the number of books they have borrowed based on transaction records
    for (const member of members) {
      const borrowedBooksCount = await Transaction.count({
        where: { memberCode: member.code, returnedDate: null },
      });

      borrowedBooksByMembers.push({ memberCode: member.code, borrowedBooksCount });
    }

    res.json({
      "success": true,
      "message": "Successfully count borrowed books by each members.",
      "borrowedBooks": borrowedBooksByMembers,
    });
  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": error.message,
    });
  }
};

module.exports = {
  getAllMembers,
  getMemberByCode,
  borrowBook,
  returnBook,
  getAllAvailableBooks,
  getBorrowedBooksByMembers,
};
