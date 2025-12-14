// src/main.jsx
import ReactDOM from "react-dom/client"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { WalletProvider } from "./context/WalletContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <WalletProvider>
  <BrowserRouter>
      <App />
  </BrowserRouter>
  </WalletProvider>
  
)