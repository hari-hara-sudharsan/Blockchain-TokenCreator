import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import TokenDetails from "./pages/TokenDetails"
import Validators from "./pages/Validators"
import Governance from "./pages/Governance"
import LaunchPage from "./pages/LaunchPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/token/:address" element={<TokenDetails />} />
      <Route path="/validators" element={<Validators />} />
      <Route path="/governance" element={<Governance />} />
      <Route path="/launchtoken" element={<LaunchPage />} />
    </Routes>
  )
}