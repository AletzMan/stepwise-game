import { Route, Routes } from "react-router";
import { Level } from "./routes/Level";
import Home from "./routes/Home";
import Levels from "./routes/Levels";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/levels/:id" element={<Level />} />
        </Routes>
    );
}

export default App;
