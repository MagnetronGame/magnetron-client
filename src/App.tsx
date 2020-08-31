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
                    <Route path={"/client"}>
                        <MagnetronClient />
                    </Route>
                    <Route path={"/host"}>
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
