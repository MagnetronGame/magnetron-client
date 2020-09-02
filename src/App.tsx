import React from "react"
import MagnetronHost from "./components/MagnetronHost"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import MagnetronFrontPage from "./components/MagnetronFrontpage"
import MagnetronClient from "./components/MagnetronClient"
import MagnetronLobbyClient from "./components/MagnetronLobbyClient"
import MagnetronLobbyHost from "./components/MagnetronLobbyHost"

function App() {
    return (
        <div style={{ height: "100vh" }}>
            <Router>
                <Switch>
                    <Route path={"/client/lobby/:pin"}>
                        <MagnetronLobbyClient />
                    </Route>
                    <Route path={"/client/game/:pin/:playerIndex"}>
                        <MagnetronClient />
                    </Route>
                    <Route path={"/host/create"}>
                        <MagnetronLobbyHost shouldCreateLobby={true} />
                    </Route>
                    <Route path={"/host/lobby/:pin"}>
                        <MagnetronLobbyHost shouldCreateLobby={false} />
                    </Route>
                    <Route path={"/host/game/:pin"}>
                        <MagnetronHost />
                    </Route>
                    <Route path={"/"}>
                        <MagnetronFrontPage />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App
