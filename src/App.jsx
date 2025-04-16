import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [currency, setCurrency] = useState("€");
  const [billHistory, setBillHistory] = useState([]);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value, billDetails) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    const newEntry = {
      id: crypto.randomUUID(),
      friendName: selectedFriend.name,
      amount: billDetails.bill,
      paidBy: billDetails.whoIsPaying,
      currency: billDetails.currency,
      date: new Date().toLocaleString(),
    };

    setBillHistory((prev) => [newEntry, ...prev]);
    setSelectedFriend(null);
  }

  function handleCurrencyChange(e) {
    setCurrency(e.target.value);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="currency-selector">
          <label>Currency: </label>
          <select value={currency} onChange={handleCurrencyChange}>
            <option value="€">€ Euro</option>
            <option value="$">$ USD</option>
            <option value="₹">₹ INR</option>
            <option value="£">£ GBP</option>
          </select>
        </div>

        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
          currency={currency}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={(value) =>
            handleSplitBill(value, {
              bill: Math.abs(value),
              whoIsPaying: value > 0 ? selectedFriend.name : "You",
              currency: currency,
            })
          }
          currency={currency}
          key={selectedFriend.id}
        />
      )}

      <BillHistory history={billHistory} />
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend, currency }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          currency={currency}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend, currency }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {currency}
          {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {currency}
          {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌄 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill, currency }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    const value = whoIsPaying === "user" ? paidByFriend : -paidByUser;

    onSplitBill(value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value ({currency})</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍‍♀️ Your expense ({currency})</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>
        👫 {selectedFriend.name}'s expense ({currency})
      </label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

function BillHistory({ history }) {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Bill History</h2>
      {history.length === 0 && <p>No bills yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map((entry) => (
          <li
            key={entry.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              backgroundColor: "#fff4e6",
            }}
          >
            <strong>{entry.friendName}</strong> — {entry.currency}
            {entry.amount} paid by {entry.paidBy}
            <div style={{ fontSize: "0.9rem", color: "#868e96" }}>
              {entry.date}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
