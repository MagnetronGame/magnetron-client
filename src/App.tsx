import React from "react"
import MagnetronGame from "./components/MagnetronGame"
import MagnetronHost from "./components/MagnetronHost"
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom"
import MagnetronFrontPage from "./components/MagnetronFrontpage"
import MagnetronClient from "./components/MagnetronClient"

function App() {
    return (
        <div style={{ height: "100vh" }}>
            <Router>
                <Switch>
                    <Route to={"/"}>
                        <MagnetronFrontPage />
                    </Route>
                    <Route to={"/client"}>
                        <MagnetronClient />
                    </Route>
                    <Route to={"/host"}>
                        <div style={{ width: "70%", height: "70%" }}>
                            <MagnetronHost />
                        </div>
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App
