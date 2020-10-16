import React from "react"
import MagnetronHost from "./components/magnetron_host/MagnetronHost"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import MagnetronFrontPage from "./components/MagnetronFrontpage"
import MagnetronGameClient from "./components/magnetron_client/MagnetronGameClient"
import MagnetronLobbyClient from "./components/magnetron_client/MagnetronLobbyClient"
import MagnetronLobbyCreate from "./components/magnetron_host/MagnetronLobbyCreate"
import MagnetronTestAll from "./components/magnetron_test/MagnetronTestAll"
import { parseQueryParams } from "./utils/queryParser"
import { setCookiePrefix } from "./services/cookies"
import { ThemeProvider } from "styled-components"
import MagnetronTheme from "./MagnetronTheme"
import PageWrapper from "./components/PageWrapper"
import MagnetronLobbyJoin from "./components/magnetron_client/MagnetronLobbyJoin"
import MagnetronLobbyHost from "./components/magnetron_host/MagnetronLobbyHost"

function App() {
    const { cookiePrefix } = parseQueryParams(window.location.search)
    if (cookiePrefix) {
        setCookiePrefix(cookiePrefix)
    }

    const routePage = (
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

                <Route path={"/host/game/:gameId"}>
                    <MagnetronHost />
                </Route>

                <Route path={"/client/lobby/join/:pin"}>
                    <MagnetronLobbyJoin />
                </Route>
                <Route path={"/client/lobby/:pin/:playerIndex"}>
                    <MagnetronLobbyClient />
                </Route>
                <Route path={"/client/game/:gameId/:playerIndex"}>
                    <MagnetronGameClient />
                </Route>

                <Route path={"/test"}>
                    <MagnetronTestAll />
                </Route>
            </Switch>
        </Router>
    )

    return (
        <ThemeProvider theme={MagnetronTheme}>
            <div style={{ height: "100vh" }}>
                <PageWrapper development={process.env.NODE_ENV === "development"}>
                    {routePage}
                </PageWrapper>
            </div>
        </ThemeProvider>
    )
}

export default App
