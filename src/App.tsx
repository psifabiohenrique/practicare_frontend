import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { RecordingProvider } from "./components/AudioRecorder/AudioRecorderContext";
import { AppRoutes } from "./router/AppRoutes";
import AudioRecorder from "./components/AudioRecorder/AudioRecorder";
import { AuthGate } from "./auth/AuthGate";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate>
          <RecordingProvider>
            <AudioRecorder />
            <AppRoutes />
          </RecordingProvider>
        </AuthGate>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
