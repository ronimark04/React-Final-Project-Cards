import { useContext } from "react";
import { SiteTheme } from "../App";

function NotFound() {
    const themes = useContext(SiteTheme)

    return (<div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
        <h1 style={{ color: themes.page.textColor }}>404 Not Found</h1>
        <p style={{ color: themes.page.textColor }}>This page doesn't exist</p>
    </div>);
}

export default NotFound;