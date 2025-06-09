const STORAGE_KEY = "bookshelf_books";

const bookForm = document.getElementById("bookForm");
const incompleteContainer = document.getElementById("incompleteBookList");
const completeContainer = document.getElementById("completeBookList");

function getBooks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function renderBooks(search = "") {
    console.log("Rendering books with search query:", search);
    const books = getBooks();
    incompleteContainer.innerHTML = "";
    completeContainer.innerHTML = "";
    // Filter books based on search query
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(search.toString().toLowerCase())
    );

    filteredBooks.forEach((book) => {
        const div = document.createElement("div");
        div.className = "book";
        div.innerHTML = `
        <div data-bookid="${book.id}" data-testid="bookItem" class="mb-3 border p-3">
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
            <button data-testid="bookItemIsCompleteButton" class="btn btn-primary" onclick="toggleBook(${book.id})">${book.isComplete ? "Belum selesai" : "Selesai dibaca"}</button>
            <button data-testid="bookItemDeleteButton" class="btn btn-danger" onclick="deleteBook(${book.id})">Hapus Buku</button>
            <button data-testid="bookItemEditButton" class="btn btn-primary" onclick="editBook(${book.id})">Edit Buku</button>
            </div>
        </div>
    `;

        if (book.isComplete) {
            completeContainer.appendChild(div);
        } else {
            incompleteContainer.appendChild(div);
        }
    });
}

function addOrUpdateBook(e) {
    e.preventDefault();
    const id = document.getElementById("bookFormId").value;
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    let books = getBooks();
    if(id) {
        // Update mode
        books = books.map((book) =>
            book.id === parseInt(id)
                ? { ...book, title, author, year, isComplete }
                : book
        );
    } else {
        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete,
        };

        books.push(newBook);
    }
    saveBooks(books);
    renderBooks();
    bookForm.reset();
}

function toggleBook(id) {
    const books = getBooks();
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books[index].isComplete = !books[index].isComplete;
        saveBooks(books);
        renderBooks();
    }
}

function editBook(id) {
    const books = getBooks();
    
    const book = books.find((b) => b.id === id);
    console.log(book);
    if (book) {
        document.getElementById("bookFormId").value = book.id;
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;
        document.getElementById("bookFormSubmit").textContent = "Update Buku";
    }
}

function deleteBook(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
        return;
    }
    const books = getBooks().filter((book) => book.id !== id);
    saveBooks(books);
    renderBooks();
}

bookForm.addEventListener("submit", addOrUpdateBook);
document.getElementById("searchSubmit").addEventListener("click", function (event) {
    // Prevent default form submission
    event.preventDefault();
    const searchQuery = this.value;
    renderBooks(searchQuery);
});
window.addEventListener("DOMContentLoaded", renderBooks);
