const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: API operations related to library members
 */

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         descripion: Internal server error
 */
router.get('/', memberController.getAllMembers);

/**
 * @swagger
 * /memebrs/search:
 *   get:
 *     summary: Get member by code
 *     description: Get member information by its code.
 *     parameters:
 *       - in: query
 *         name: memberCode
 *         schema:
 *           type: string
 *         description: member code to search for.
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: member not found
 *       500:
 *         description: Internal server error
 */
router.get('/search', memberController.getMemberByCode);

/**
 * @swagger
 * /members/borrow:
 *   post:
 *     summary: Borrow a book
 *     description: Allow a member to borrow a book.
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               memberCode:
 *                 type: string
 *                 description: Member code.
 *               bookCode:
 *                 type: string
 *                 description: Book code.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.post('/borrow', memberController.borrowBook);

/**
 * @swagger
 * /members/return:
 *   post:
 *     summary: Return a book
 *     description: Allow a member to return a book.
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID.
 *               memberCode:
 *                 type: string
 *                 description: Member code.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 */
router.post('/return', memberController.returnBook);

/**
 * @swagger
 * /members/check:
 *   get:
 *     summary: Get all available books and quantities
 *     responses:
 *       200:
 *         description: List of available books and their quantities
 *       500:
 *         description: Internal server error
 */
router.get('/check', memberController.getAllAvailableBooks);

/**
 * @swagger
 * /members/borrowedBooks:
 *   get:
 *     summary: Get the number of books borrowed by each member
 *     responses:
 *       200:
 *         description: Number of books borrowed by the member
 */
router.get('/borrowedBooks', memberController.getBorrowedBooksByMembers);

module.exports = router;
