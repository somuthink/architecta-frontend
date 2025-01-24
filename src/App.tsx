import { Route, Switch } from "wouter";
import "./index.css";
import { generatePage } from "./pages/generate/generatePage";

function App() {
    return (
        <Switch>
            <Route path="/" component={generatePage}></Route>
        </Switch>
    );
}

export default App;
