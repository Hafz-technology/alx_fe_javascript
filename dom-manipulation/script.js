
let quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
            { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
            { text: "Strive not to be a success, but rather to be of value.", category: "Success" },
            { text: "I have not failed. I've just found 10,000 ways that won't work.", category: "Perseverance" }
        ];

        // Get DOM elements
        const quoteDisplay = document.getElementById('quoteDisplay');
        const newQuoteBtn = document.getElementById('newQuote');
        const addQuoteBtn = document.getElementById('addQuote');
        const newQuoteText = document.getElementById('newQuoteText');
        const newQuoteCategory = document.getElementById('newQuoteCategory');
        const exportQuotesBtn = document.getElementById('exportQuotes');
        const importFile = document.getElementById('importFile');

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

        // Function to show a random quote
        function showRandomQuote() {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];
            
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
            const text = newQuoteText.value.trim();
            const category = newQuoteCategory.value.trim();
            
            if (text === '' || category === '') {
                // Use a simple alert-like message in the UI instead of a browser alert
                alert("Please fill out both quote text and category.");
                return;
            }

            const newQuote = { text: text, category: category };
            quotes.push(newQuote);
            saveQuotes(); // Save to local storage
            showRandomQuote(); // Show the newly added quote or a new random one

            // Clear input fields
            newQuoteText.value = '';
            newQuoteCategory.value = '';
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
                        quotes.push(...importedQuotes);
                        saveQuotes();
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
        
        // Event listeners
        newQuoteBtn.addEventListener('click', showRandomQuote);
        addQuoteBtn.addEventListener('click', addQuote);
        exportQuotesBtn.addEventListener('click', exportQuotes);

        // Initial setup
        loadQuotes();
        showRandomQuote();







