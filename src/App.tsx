import React from "react"
import MagnetronHost from "./components/MagnetronHost"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import MagnetronFrontPage from "./components/MagnetronFrontpage"
import MagnetronClient from "./components/MagnetronClient"

function App() {
    return (
        <div style={{ height: "100vh" }}>
            <Router>
                <Switch>
                    <Route path={"/client/:pin"}>
                        <MagnetronClient />
                    </Route>
                    <Route path={"/host/create"}>
                        <MagnetronHost shouldCreateGame={true} />
                    </Route>
                    <Route path={"/host/lobby/:pin"}>
                        <MagnetronHost shouldCreateGame={true} />
                    </Route>
                    <Route path={"/host/:pin"}>
                        <MagnetronHost shouldCreateGame={false} />
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
