import fs from "fs";
import {v4 as uuid} from "uuid";
export { updateBookDto } from './update-book-dto.js'

export class Book {
    constructor(title, author, publicationDate, imgURL = 'public/image/image.jpg') {
        this.title = title;
        this.author = author;
        this.imgURL = imgURL;
        this.publicationDate = publicationDate;
        this.reader = null;
        this.expirationDate = null;
    }
}

export class Library {
    constructor() {
        this.books = {}
        try {
            this.books = JSON.parse(fs.readFileSync('/home/toa/WebstormProjects/home-library/db.json', 'utf-8'));
        } catch {
            console.log("Error, file is not exist!");
        }
    }

    save() {
        fs.writeFile('db.json', JSON.stringify(this.books), (err) => {
            if (err) throw err;
            console.log('saved in file db.json');
        })
    }

    getAllBooks() {
        return this.books;
    }

    getBookByID(id) {
        return this.books[id];
    }

    deleteBook(id) {
        if (id in this.books) {
            delete this.books[id];
            this.save();
            return true;
        }
        return false;
    }

    getNotRented() {
        let rented = {};
        for(const key in this.books){
            if(this.books[key].reader == null){
                rented[key] = this.books[key];
            }
        }
        return rented;
    }

    getExpired() {
        let expired = {};
        for (const key in this.books) {
            let date = new Date(this.books[key].expirationDate)
            if (date < Date.now() && this.books[key].reader !== null) {
                expired[key] = this.books[key];
            }
        }
        return expired;
    }

    updateBook(id, dto) {
        let book = this.getBookByID(id);
        if (book !== undefined) {
            let updBook = {};
            Object.keys(dto).forEach(key => {
                if(dto[key] === undefined) {
                    updBook[key] = book[key];
                }
                else {
                    updBook[key] = dto[key];
                }
            });
            this.books[id] = updBook;
            this.save();
            return true;
        }
        return false;
    }

    createBook(title, author, pubDate, imgURL = '') {
        let book = new Book(title, author, imgURL);
        const id = uuid();
        this.books[id] = book;
        this.save();
    }
}