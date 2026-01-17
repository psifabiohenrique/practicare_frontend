import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { RecordingProvider } from "./components/AudioRecorder/AudioRecorderContext";
import { AppRoutes } from "./router/AppRoutes";
import AudioRecorder from "./components/AudioRecorder/AudioRecorder";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RecordingProvider>
          <AudioRecorder />
          <AppRoutes />
        </RecordingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
