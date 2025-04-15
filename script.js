// Initialize transactions from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const dateInput = document.getElementById('date');
const transactionList = document.getElementById('transaction-list');
const totalBalanceEl = document.getElementById('total-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');

// Set default date to today
dateInput.valueAsDate = new Date();

// Add transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        description: descriptionInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        date: dateInput.value
    };

    transactions.push(transaction);
    updateLocalStorage();
    updateUI();
    form.reset();
    dateInput.valueAsDate = new Date();
});

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Calculate totals
function calculateTotals() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0);

    const balance = income - expenses;

    return { income, expenses, balance };
}

// Update UI
function updateUI() {
    const { income, expenses, balance } = calculateTotals();

    totalBalanceEl.textContent = formatCurrency(balance);
    totalIncomeEl.textContent = formatCurrency(income);
    totalExpensesEl.textContent = formatCurrency(expenses);

    // Update transaction list
    transactionList.innerHTML = '';
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    sortedTransactions.forEach(transaction => {
        const div = document.createElement('div');
        div.classList.add('transaction-item', transaction.type);

        const formattedDate = new Date(transaction.date).toLocaleDateString();
        const formattedAmount = formatCurrency(transaction.amount);

        div.innerHTML = `
            <span class="description">${transaction.description}</span>
            <span class="amount">${formattedAmount}</span>
            <span class="date">${formattedDate}</span>
            <button onclick="deleteTransaction(${transaction.id})" class="delete-btn">&times;</button>
        `;

        transactionList.appendChild(div);
    });
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateUI();
}

// Initial UI update
updateUI();