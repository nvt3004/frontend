import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./routes/AuthContext";
function App() {
  return (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  );
}

export default App;
