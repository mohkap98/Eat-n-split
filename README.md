# Eat-n-Split

Eat-n-Split is a React-based app designed to manage and split bills with friends. You can add friends, track balances, split bills, and view the history of past transactions in different currencies.

## Features

- **Currency Selector**: Choose between multiple currencies (Euro, USD, INR, GBP).
- **Add Friends**: Add friends and manage their balances.
- **Split Bills**: Split bills between you and your selected friend, updating balances.
- **Bill History**: View the history of previous bill transactions.
- **Responsive Design**: Mobile-friendly with a grid-based layout and flexbox.
- **Smooth Animations**: Hover effects and transitions for a polished user experience.

## Project Structure


## State Management

The app uses React's `useState` to manage the following states:

- **friends**: Stores an array of friends, each with an `id`, `name`, `image`, and `balance`.
- **selectedFriend**: Stores the currently selected friend with whom the user wants to split a bill.
- **currency**: Stores the selected currency (Euro, USD, INR, GBP).
- **showAddFriend**: Toggles the visibility of the "Add Friend" form.
- **billHistory**: Stores an array of past transactions, each representing a bill split.

### Managing State in App

- **friends**: Holds data for all the friends and their respective balances.
- **currency**: Stores the selected currency, which is used when displaying the balance.
- **billHistory**: Each time a bill is split, an entry is added to this array that keeps track of the transaction details (who paid, who was paid, bill amount, and currency).

## How to Use

1. **Add a Friend**: Click "Add Friend", enter the name and image URL, then click "Add".
2. **Select a Friend**: Click on a friend's name to split a bill with them.
3. **Split a Bill**: Enter the bill amount, your expense, and select who is paying. The balances of both the user and the friend will be updated.
4. **View Bill History**: Access the history of previous bill splits in the "Bill History" section.
5. **Change Currency**: Use the currency selector to switch between different currencies (Euro, USD, INR, GBP).

## How to Run the Project

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mohkap98/Eat-n-split.git
   cd Eat-n-split
