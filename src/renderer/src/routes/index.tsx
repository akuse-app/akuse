import { Switch, Route } from "wouter"
import Home from "@renderer/pages/Home"
import Library from "@renderer/pages/Library"

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/library" component={Library} />
    </Switch>
  )
}
