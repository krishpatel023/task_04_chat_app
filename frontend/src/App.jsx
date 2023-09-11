import BasicModalDialog from "./pages/Modal"
import PollResult from "./pages/PollResult"
import Chat from "./pages/chat"
import '@fontsource/inter'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/poll/:id" element={<PollResult />} />
          <Route path="*" element={<Chat />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
