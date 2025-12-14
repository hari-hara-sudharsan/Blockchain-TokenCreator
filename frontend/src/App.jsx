// import { Routes, Route } from "react-router-dom"
// import NavBar from "./components/NavBar"
// import Home from "./pages/Home"
// import TokenPage from "./pages/TokenPage"
// import LaunchPage from "./pages/LaunchPage"
// import Validators from "./pages/Validators"
// import Governance from "./pages/Governance"

// export default function App() {
//   return (
//     <>
//       <NavBar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/token/:address" element={<TokenPage />} />
//         <Route path="/launch" element={<LaunchPage />} />
//         <Route path="/validators" element={<Validators />} />
//         <Route path="/governance" element={<Governance />} />
//       </Routes>
//     </>
//   )
// }

import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import TokenDetails from "./pages/TokenDetails"
import Validators from "./pages/Validators"
import Governance from "./pages/Governance"



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/token/:address" element={<TokenDetails />} />
      <Route path="/validators" element={<Validators />} />
      <Route path="/governance" element={<Governance />} />
    </Routes>
  )
}