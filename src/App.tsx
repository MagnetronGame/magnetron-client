import React from "react"
import MagnetronGame from "./components/MagnetronGame"
import Magnetron from "./components/Magnetron"

function App() {
    return (
        <div style={{ height: "100vh" }}>
            <div style={{ width: "70%", height: "70%" }}>
                {/*<MagnetronGame style={{width: "70%", height: "70%"}}/>*/}
                <Magnetron />
            </div>{" "}
        </div>
    )
}

export default App
