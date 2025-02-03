
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

 // Function to handle the book check-in and lost report
 function updateBooks() {
    // Get form values
    const bookName = document.getElementById('bookName').value;
    const personName = document.getElementById('personName').value;
    const isLost = document.getElementById('isLost').checked;  // Get the checkbox value

    // Create the request body
    const requestBody = {
        bookName: bookName,
        personName: personName,
        isLost: isLost  // Include the lost status in the request
    };

    // Send a POST request to the /submit-checkin API
    fetch('/submit-checkin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response, e.g., show a success message
        if (data.success) {
            alert('Book status updated successfully!');
        } else {
            alert('Error updating book status. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Prevent the default form submission
    return false;
}

 // Function to handle the book donation
 function donateBook() {
    // Get form values
    const bookName = document.getElementById('bookName').value;
    const author = document.getElementById('author').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    // Get the current date (for the donation date)
    const donationDate = new Date().toISOString().split('T')[0];  // Format YYYY-MM-DD

    // Create the request body
    const requestBody = {
        bookName: bookName,
        author: author,
        firstName: firstName,
        lastName: lastName,
        donationDate: donationDate
    };

    // Send a POST request to the /submit-donation API
    fetch('/submit-donation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response, e.g., show a success message
        if (data.success) {
            alert('Thank you for your donation!');
        } else {
            alert('Error donating the book. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Prevent the default form submission
    return false;
}
