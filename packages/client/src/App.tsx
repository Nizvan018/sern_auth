import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/auth/login";
import EmailVerify from "./pages/emailVerify";
import ResetPassword from "./pages/resetPassword";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/auth.provider";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./pages/protected/userProfile";

import "@fontsource-variable/rubik";
import Register from "./pages/auth/register";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/email_verify" element={<EmailVerify />} />
					<Route path="/reset_password" element={<ResetPassword />} />

					<Route element={<ProtectedRoute />}>
						<Route path="/user_profile" element={<UserProfile />} />
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}

export default App;
