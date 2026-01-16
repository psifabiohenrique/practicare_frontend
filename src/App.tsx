import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { AppRoutes } from "./router/AppRoutes";
import AudioRecorder from "./components/AudioRecorder/AudioRecorder";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AudioRecorder />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
