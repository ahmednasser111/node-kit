# ⚡ NodeKit

NodeKit is a powerful Node.js application that demonstrates the integration of modern web technologies including Express.js, EJS templating, cookie-based authentication, network programming, and file management.

## 🚀 Features

- **🔐 Secure Authentication:** Cookie-based session management with `cookie-parser` and custom middleware.
- **📁 File Management:** robust file upload and download capabilities using `Multer`.
- **🌐 Network Tools:** 
    - Real-time Server IP & Interface monitoring.
    - DNS Lookup utility.
    - TCP Port Checker (using Node's `net` module).
- **📡 TCP Echo Server:** A raw TCP server running on a separate port for low-level network communication testing.
- **🎨 Modern UI:** Responsive design using EJS partials and vanilla CSS.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS (Embedded JavaScript), Vanilla CSS
- **Middleware:** Multer (File Uploads), Cookie-Parser
- **Networking:** Built-in `net`, `dns`, and `os` modules

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (installed automatically with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/node-hub.git
   cd node-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Ports
- **Web Portal:** `http://localhost:3000`
- **TCP Echo Server:** `localhost:4000`

## � Demo Credentials

| Username | Password | Role |
|----------|----------|------|
| `ahmed`  | `1234`   | Admin|
| `user`   | `pass`   | User |
| `guest`  | `guest`  | Guest|

## ⚙️ Configuration (Production)

The application supports environment variables for deployment:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port for the Express web server |
| `TCP_PORT` | `4000` | Port for the TCP Echo server |
| `NODE_ENV` | `development` | Set to `production` for secure cookies |

## 📂 Project Structure

```bash
node-hub/
├── middleware/    # Authentication guards
├── public/        # Static assets (CSS, Images)
├── routes/        # Auth, File, and Network routes
├── uploads/       # Storage for uploaded files
├── views/         # EJS templates and partials
└── server.js      # Main entry point (HTTP & TCP)
```

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
