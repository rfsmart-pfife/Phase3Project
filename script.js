
function searchBooks() {
    // Get the search input value
    let input = document.getElementById('searchBar').value.toUpperCase();
    let ul = document.getElementById("availableBooks");
    let li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those that don't match the search query
    for (let i = 0; i < li.length; i++) {
        let bookTitle = li[i].innerText.toUpperCase();
        if (bookTitle.indexOf(input) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function fetchBooks() {
    fetch('/api/books')  //API endpoint
    .then(response => response.json())
    .then(data => {
        let bookList = document.getElementById('availableBooks');
        bookList.innerHTML = ''; // Clear the list before adding new items
        
        // Loop through the data and create list items for each book
        data.forEach(book => {
            let li = document.createElement('li');
            li.textContent = `${book.title} by ${book.author}`;
            bookList.appendChild(li);
        });
    })
    .catch(error => console.error('Error fetching books:', error));
}
