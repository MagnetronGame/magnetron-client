import React from "react"
import MagnetronHost from "./components/magnetron_host/MagnetronHost"
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom"
import MagnetronFrontPage from "./components/MagnetronFrontpage"
import MagnetronClient from "./components/magnetron_client/MagnetronClient"
import MagnetronLobbyClient from "./components/magnetron_client/MagnetronLobbyClient"
import MagnetronLobbyHost from "./components/magnetron_host/MagnetronLobbyHost"
import MagnetronLobbyCreate from "./components/magnetron_host/MagnetronLobbyCreate"
import MagnetronGameStart from "./components/magnetron_host/MagnetronGameStart"
import MagnetronLobbyJoin from "./components/magnetron_client/MagnetronLobbyJoin"
import MagnetronTestAll from "./components/magnetron_test/MagnetronTestAll"
import { parseQueryParams, stringifyQueryParams } from "./utils/queryParser"
import { setCookiePrefix } from "./services/cookies"

function App() {
    const { cookiePrefix } = parseQueryParams(window.location.search)
    if (cookiePrefix) {
        setCookiePrefix(cookiePrefix)
    }

    return (
        <div style={{ height: "100vh" }}>
            <Router>
                <Switch>
                    <Route exact path={"/"}>
                        <MagnetronFrontPage />
                    </Route>

                    <Route path={"/host/lobby/create"}>
                        <MagnetronLobbyCreate />
                    </Route>

                    <Route path={"/host/lobby/:pin"}>
                        <MagnetronLobbyHost />
                    </Route>

                    <Route path={"/host/game/start/:pin"}>
                        <MagnetronGameStart />
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

                    <Route path={"/test"}>
                        <MagnetronTestAll />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App
