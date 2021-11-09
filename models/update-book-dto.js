export class updateBookDto {

    constructor(data = null) {
        this.author = data?.author;
        this.title = data?.title;
        this.publicationDate = data?.publicationDate;
        this.expirationDate = data?.expirationDate;
        this.reader = data?.reader;
        this.imgURL = data?.imgURL;
    }

}