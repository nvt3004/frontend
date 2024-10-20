import React, { useEffect } from "react";
import store from './store/store'; // Redux store
import { Provider } from 'react-redux'; // Import Provider của redux
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./routes/AuthContext";

function App() {
    

    return (
        <Provider store={store}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Provider>
    );
}

export default App;
