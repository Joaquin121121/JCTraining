import logo from "./logo.svg";
import "./App.css";
import Main from "./components/Main";
import { UserProvider } from "./contexts/UserContext";
function App() {
  return (
    <div className="App">
      <UserProvider>
        <Main />
      </UserProvider>
    </div>
  );
}

export default App;
