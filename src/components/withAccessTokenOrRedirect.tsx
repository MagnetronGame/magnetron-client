import React from "react"
import { Redirect } from "react-router-dom"
import { cookies } from "../services/cookies"

export default (
    Comp: React.FC<{ accessToken: string; [k: string]: any }>,
    redirect = "/",
): React.FC<{ [K: string]: any }> => (props) => {
    const accessToken = cookies.accessToken.get()
    return accessToken ? <Comp accessToken={accessToken} {...props} /> : <Redirect to={redirect} />
}
