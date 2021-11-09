import express from "express";
import {Library} from "./models/models.js";
import { updateBookDto } from "./models/models.js";

export const router = express.Router();
const homeLib = new Library();

router.get('/books', (req, res, next) => {
    res.json(homeLib.getAllBooks());
    next();
});

router.get('/books/not_rented', (req, res, next) => {
    res.json(homeLib.getNotRented());
    next();
})

router.get('/books/expired', (req, res, next) => {
    res.json(homeLib.getExpired());
    next();
})

router.post('/books', (req, res, next) => {
    if (req.body.imgURL !== "") {
        homeLib.createBook(req.body.title, req.body.author, req.body.publicationDate, req.body.imgURL);
    } else {
        homeLib.createBook(req.body.title, req.body.author, req.body.publicationDate, '/public/images/imag.jpg');
    }
    next();
});

router.delete('/books/:id', (req, res, next) => {
    homeLib.deleteBook(req.params.id);
    next();
});

router.post('/books/:id/set_reader', (req, res, next) => {
    let dto = new updateBookDto(req.body);
    homeLib.updateBook(req.params.id, dto);
    next();
});

router.post('/books/:id/return', (req, res, next) => {
    let dto = new updateBookDto({
        reader: null,
        expirationDate: null
    });
    homeLib.updateBook(req.params.id, dto);
    next();
});