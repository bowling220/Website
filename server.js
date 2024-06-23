const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Path to the user.json file
const userFilePath = path.join(__dirname, 'user.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read the users file
const readUsers = () => {
    if (!fs.existsSync(userFilePath)) {
        return { users: [] }; // Return empty users list if file doesn't exist
    }
    const data = fs.readFileSync(userFilePath);
    return JSON.parse(data);
};

// Helper function to write to the users file
const writeUsers = (users) => {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
};

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = readUsers().users;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const data = readUsers();
    const users = data.users;

    if (users.find(user => user.username === username)) {
        res.json({ success: false, message: 'Username already exists' });
    } else {
        users.push({ username, password });
        writeUsers(data);
        res.json({ success: true });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
