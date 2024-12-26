import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./Pages/login";
import SignupPage from "./Pages/signup";
import Dashboard from "./Pages/dashboard";
import { Authprovider } from "./context/authcontext";

interface AuthRouteProps {
  children: React.ReactNode;
}
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function App() {
  return (
    <Authprovider>
      <Router>
        <Routes>
          <Route path="/" element={
            <AuthRoute><LoginPage /> </AuthRoute>} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Authprovider>
  );
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const storedData = JSON.parse(localStorage.getItem("user_data") || "{}");
  console.log(storedData);  
  if (!storedData.userTocken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const storedData = JSON.parse(localStorage.getItem("user_data") || "{}");
  if (storedData.userTocken) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default App;
