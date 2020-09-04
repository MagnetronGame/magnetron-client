import React from "react"
import MagnetronHost from "./components/MagnetronHost"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import MagnetronFrontPage from "./components/MagnetronFrontpage"
import MagnetronClient from "./components/MagnetronClient"
import MagnetronLobbyClient from "./components/MagnetronLobbyClient"
import MagnetronLobbyHost from "./components/MagnetronLobbyHost"
import MagnetronLobbyCreate from "./components/MagnetronLobbyCreate"
import MagnetronGameCreate from "./components/MagnetronGameCreate"
import MagnetronLobbyJoin from "./components/MagnetronLobbyJoin"

function App() {
    return (
        <div style={{ height: "100vh" }}>
            <Router>
                <Switch>
                    <Route path={"/host/lobby/create"}>
                        <MagnetronLobbyCreate />
                    </Route>

                    <Route path={"/host/lobby/:pin"}>
                        <MagnetronLobbyHost />
                    </Route>

                    <Route path={"/host/game/create/:pin"}>
                        <MagnetronGameCreate />
                    </Route>
                    <Route path={"/host/game/:pin"}>
                        <MagnetronHost />
                    </Route>

                    <Route path={"/client/lobby/join/:pin"}>
                        <MagnetronLobbyJoin />
                    </Route>
                    <Route path={"/client/lobby/:pin/:playerIndex"}>
                        <MagnetronLobbyClient />
                    </Route>
                    <Route path={"/client/game/:pin/:playerIndex"}>
                        <MagnetronClient />
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
