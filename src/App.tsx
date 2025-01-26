import { Route, Switch } from "wouter";
import "./index.css";
import { generatePage } from "./pages/generate/generatePage";
import { ThemeProvider } from "@/components/theme/themeProvider";

function App() {
    return (
        <Switch>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="h-full">
                    <Route path="/" component={generatePage}></Route>
                </div>
            </ThemeProvider>
        </Switch>
    );
}

export default App;
