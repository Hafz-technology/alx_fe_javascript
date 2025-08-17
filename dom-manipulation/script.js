// Initial array of quotes
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Success" },
    { text: "I have not failed. I've just found 10,000 ways that won't work.", category: "Perseverance" }
];

// Simulate a server-side data store
// In a real application, this would be a database accessible via an API
let serverQuotes = [
    { text: "The best way to predict the future is to create it.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Life" }
];

// Get DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const showAddQuoteFormBtn = document.getElementById('showAddQuoteFormBtn');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
const exportQuotesBtn = document.getElementById('exportQuotes');
const importFile = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');
const statusMessage = document.getElementById('statusMessage');

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Function to populate the category filter dropdown
function populateCategories() {
    // Get unique categories from the quotes array
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];

    // Clear existing options
    categoryFilter.innerHTML = '';

    // Create and append a default option for all categories
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Categories';
    categoryFilter.appendChild(allOption);

    // Create and append options for each unique category
    categories.forEach(category => {
        if (category !== 'all') {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    });
}

// Function to show a random quote from the specified category
function showRandomQuote(category = 'all') {
    let filteredQuotes = quotes;
    if (category !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === category);
    }
    
    // Handle case where no quotes are found for the selected category
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p class="text-gray-500 text-lg">No quotes found for this category.</p>';
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    
    // Clear previous content
    quoteDisplay.innerHTML = '';

    // Create new elements for the quote and category
    const quoteText = document.createElement('p');
    quoteText.classList.add('quote-text');
    quoteText.textContent = `"${randomQuote.text}"`;

    const quoteCategory = document.createElement('p');
    quoteCategory.classList.add('quote-category');
    quoteCategory.textContent = `— ${randomQuote.category}`;

    // Append new elements to the display div
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();
    
    if (text === '' || category === '') {
        // Use a simple alert-like message in the UI instead of a browser alert
        alert("Please fill out both quote text and category.");
        return;
    }

    const newQuote = { text: text, category: category };
    
    // Add to local data
    quotes.push(newQuote);
    saveQuotes();

    // Simulate sending data to the server (adds it to the serverQuotes array)
    serverQuotes.push(newQuote);
    statusMessage.textContent = 'New quote added. Syncing with server...';
    
    populateCategories(); // Update the categories list
    showRandomQuote(); // Show the newly added quote or a new random one

    // Clear input fields
    newQuoteText.value = '';
    newQuoteCategory.value = '';
}

// Function to create and add the quote form dynamically
function createAddQuoteForm() {
    // Check if form already exists to prevent duplicates
    if (addQuoteFormContainer.innerHTML !== '') {
        return;
    }

    const formDiv = document.createElement('div');
    formDiv.classList.add('quote-form');

    const quoteTextInput = document.createElement('input');
    quoteTextInput.setAttribute('id', 'newQuoteText');
    quoteTextInput.setAttribute('type', 'text');
    quoteTextInput.setAttribute('placeholder', 'Enter a new quote');

    const quoteCategoryInput = document.createElement('input');
    quoteCategoryInput.setAttribute('id', 'newQuoteCategory');
    quoteCategoryInput.setAttribute('type', 'text');
    quoteCategoryInput.setAttribute('placeholder', 'Enter quote category');

    const addQuoteButton = document.createElement('button');
    addQuoteButton.setAttribute('id', 'addQuote');
    addQuoteButton.textContent = 'Add Quote';
    addQuoteButton.addEventListener('click', addQuote);

    formDiv.appendChild(quoteTextInput);
    formDiv.appendChild(quoteCategoryInput);
    formDiv.appendChild(addQuoteButton);

    addQuoteFormContainer.appendChild(formDiv);
}

// Function to export quotes to a JSON file
function exportQuotes() {
    const jsonQuotes = JSON.stringify(quotes, null, 2); // Use 2-space indentation for readability
    const blob = new Blob([jsonQuotes], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file (provided by user)
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            // Validate that imported data is an array of objects
            if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
                // Add to local and simulated server data
                quotes.push(...importedQuotes);
                serverQuotes.push(...importedQuotes);
                saveQuotes();
                populateCategories(); // Update the categories list
                showRandomQuote(); // Display a new random quote
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid JSON file format. Please upload a file with an array of quote objects.');
            }
        } catch (e) {
            alert('Error parsing JSON file. Please check the file format.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to filter quotes based on the selected dropdown value
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastCategoryFilter', selectedCategory);
    showRandomQuote(selectedCategory);
}

// Function to simulate fetching quotes from the server
async function fetchQuotesFromServer() {
    // In a real application, you would use a fetch call to an API endpoint
    // Example: const response = await fetch('https://api.example.com/quotes');
    // For this simulation, we'll just return our mock serverQuotes array after a delay.
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(serverQuotes))); // Return a deep copy
        }, 1500); // Simulate network latency
    });
}

// Function to sync local data with the simulated server
async function syncWithServer() {
    statusMessage.textContent = 'Checking for server updates...';
    try {
        const serverData = await fetchQuotesFromServer();
        const hasConflicts = JSON.stringify(quotes) !== JSON.stringify(serverData);

        if (hasConflicts) {
            // Conflict resolution: server data takes precedence
            quotes = serverData;
            saveQuotes();
            populateCategories();
            showRandomQuote(categoryFilter.value);
            statusMessage.textContent = 'Data synced! Server updates merged.';
        } else {
            statusMessage.textContent = 'No updates from server. Local data is up-to-date.';
        }
    } catch (error) {
        statusMessage.textContent = 'Sync failed. Check network connection.';
        console.error('Sync error:', error);
    }
}

// Event listeners
newQuoteBtn.addEventListener('click', () => showRandomQuote(categoryFilter.value));
showAddQuoteFormBtn.addEventListener('click', createAddQuoteForm);
exportQuotesBtn.addEventListener('click', exportQuotes);
categoryFilter.addEventListener('change', filterQuotes);

// Initial setup
loadQuotes();
populateCategories();

// Check for a saved filter and apply it, otherwise show a random quote
const lastFilter = localStorage.getItem('lastCategoryFilter');
if (lastFilter && quotes.some(quote => quote.category === lastFilter)) {
    categoryFilter.value = lastFilter;
    showRandomQuote(lastFilter);
} else {
    showRandomQuote();
}

// Start periodic syncing with the simulated server every 15 seconds
setInterval(syncWithServer, 15000);
