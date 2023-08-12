import { ChatPage } from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";
import { ForgotPassword } from "./pages/ForgotPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProvider from "./context/userContext";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/forgotPassword/:id" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
