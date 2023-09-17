const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API operations related to library books
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', bookController.getAllBooks);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Get book by code
 *     tags: [Books]
 *     description: Get book information by its code.
 *     parameters:
 *       - in: query
 *         name: bookCode
 *         schema:
 *           type: string
 *         description: Book code to search for.
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: Book not found
 */
router.get('/search', bookController.getBookByCode);

module.exports = router;
