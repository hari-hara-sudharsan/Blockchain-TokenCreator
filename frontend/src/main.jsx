// import React from "react"
// import ReactDOM from "react-dom/client"
// import { BrowserRouter } from "react-router-dom"
// import { WagmiProvider } from "wagmi"
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import App from "./App"
// import { config } from "./lib/walletConfig"

// const queryClient = new QueryClient()

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </QueryClientProvider>
//     </WagmiProvider>
//   </React.StrictMode>
// )

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