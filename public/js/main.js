
const booksContainer = document.getElementById('books-container');
const showAllButton = document.getElementById('showAllBooks');
const showInStockButton = document.getElementById('showInStockBooks');
const showExpiredButton = document.getElementById('showExpiredBooks');

const getAllBooksUrl = '/api/books';
const getBooksInStockUrl = '/api/books/not_rented';
const getBooksExpiredUrl = '/api/books/expired';

const addReaderModal = document.getElementById('addReaderModal');
const addReaderForm = document.getElementById('addReaderForm');

function buildBookCard(id, book) {
    if (book.reader != null) {
        return `
            <div class="w3-card-4 w3-margin-bottom w3-margin-top">
                <header class="w3-container w3-red">
                    <h3><a href="/books/${id}">${book.title}</a></h3>
                </header>
                <div class="w3-container w3-padding">
                    <div class="w3-quarter">
                        <img src="${book.imgURL}" alt="${book.title}" class="w3-round" height="200" />
                    </div>
                    <div class="w3-threequarter">
                        <ul style="font-size:1.3em;">
                            <li>Автор: <strong>${book.author}</strong></li>
                            <li>Год: <strong>${book.publicationDate}</strong></li>
                            <li>Читатель: <strong>${book.reader}</strong></li>
                            <li>Дата возврата: <strong>${book.expirationDate}</strong></li>
                        </ul>
                    </div>
                </div>
                <footer class="w3-red w3-padding">
                    <button type="button" id="${id}" class="returnButton w3-btn w3-ripple w3-blue w3-border">Вернуть</button>
                </footer>
            </div>
    `;
    } else {
        return `
            <div class="w3-card-4 w3-margin-bottom w3-margin-top">
                <header class="w3-container w3-blue">
                   <h3><a href="/books/${id}">${book.title}</a></h3>
                </header>   
                 <div class="w3-container w3-padding">
                    <div class="w3-quarter">
                        <img src="${book.imgURL}" alt="${book.title}" class="w3-round" height="200" />
                    </div>
                    <div class="w3-threequarter">
                        <ul style="font-size:1.3em;">
                            <li>Автор: <strong>${book.author}</strong></li>
                            <li>Год: <strong>${book.publicationDate}</strong></li>
                        </ul>
                    </div> 
                </div>
                <footer class="w3-blue w3-padding">
                    <button type="button" class="giveAwayButton w3-btn w3-ripple w3-white w3-border w3-margin-right" id="${id}">Выдать читателю</button>
                    <button type="button" class="deleteButton w3-btn w3-ripple w3-red w3-border w3-margin-right" id="${id}">Удалить</button>
                </footer>  
            </div>    
    `;
    }
}

function rebuildBooksContainer(books) {
    let booksHtml = '';
    for (let id in books) {
        booksHtml += buildBookCard(id, books[id]);
    }
    booksContainer.innerHTML = booksHtml;
}

showAllButton.addEventListener('click', () => {
    sendRequest('GET', getAllBooksUrl)
        .then(response => {
            rebuildBooksContainer(response);
        })
        .catch(
            err => {
                console.log(err);
            }
        );
});

showExpiredButton.addEventListener("click", () => {
    sendRequest('GET', getBooksExpiredUrl)
        .then(response => {
            rebuildBooksContainer(response);
        })
        .catch(
            err => {
                console.log(err);
            }
        );
});

showInStockButton.addEventListener('click', () => {
    sendRequest('GET', getBooksInStockUrl)
        .then(response => {
            rebuildBooksContainer(response);
        })
        .catch(
            err => {
                console.log(err);
            }
        );
})

document.getElementById('newBookForm').addEventListener('submit', e => {
    let newBook = {
        title: document.getElementById('newBookTitle').value,
        author: document.getElementById('newBookAuthor').value,
        publicationDate: document.getElementById('newBookYear').value
    }
    if (document.getElementById('newBookImage').value !== "") {
        newBook['imgURL'] = document.getElementById('newBookImage').value;
    }
    sendRequest('POST', getAllBooksUrl, newBook)
        .then(response => {location.reload()})
        .catch(err => {console.log(err)});
});

document.getElementById('addReaderForm').addEventListener('submit', e => {
    let newReader = {
        id: document.getElementById('addReaderForm').getAttribute('bookID'),
        reader: document.getElementById('newReaderName').value,
        expirationDate: document.getElementById('newExpirationDate').value
    };
    sendRequest('POST', `/api/books/${newReader.id}/set_reader`, newReader)
        .then(response => location.reload())
        .catch(err => {
            console.log(err);
        })
})

window.onload = function () {
    sendRequest('GET', getAllBooksUrl)
        .then(res => {
            rebuildBooksContainer(res);

            const deleteButtons = [...document.getElementsByClassName('deleteButton')];
            deleteButtons.map(e => {
                e.addEventListener('click', () => {
                    sendRequest('DELETE', `/api/books/${e.id}`)
                        .then(res => {location.reload();})
                        .catch(err => {console.log(err);});
                });
            });

            const giveAwayButtons = [...document.getElementsByClassName('giveAwayButton')];
            giveAwayButtons.map(e => {
                e.addEventListener('click', () => {
                    console.log('ADDING READER')
                    addReaderForm.setAttribute('bookID', e.id);
                    addReaderModal.style.display = 'block';
                })
            });

            const returnButtons = [...document.getElementsByClassName('returnButton')];
            returnButtons.map(e => {
                e.addEventListener('click', () => {
                    sendRequest('POST', `/api/books/${e.id}/return`)
                        .then(res => {
                            location.reload();
                        })
                        .catch(err => {
                            console.log(err);
                            location.reload();
                        })
                })
            })
        })
}

function sendRequest (method, url, body = null){
    const headers = { "Content-Type": "application/json; charset=utf-8" };
    return fetch(url, {
        method: method,
        body: body !== null ? JSON.stringify(body) : null,
        headers: headers
    }).then(response => {
        return response.json();
    })
}