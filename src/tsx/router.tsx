/** @format*/
import React, { Component, Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

export default class Views extends Component<{}, {}> {
	//react state
	// state = {};
	lazyView = (view: string) => {
		return lazy(() => import("./views/" + view));
	};
	render() {
		return (
			<Router>
				<Suspense fallback={<div>Loading...</div>}>
					<Switch>
						<Route
							exact
							path="/"
							component={this.lazyView("_Home")}
						/>
						<Route
							exact
							path="/getting-started"
							component={this.lazyView("_GettingStarted")}
						/>
						<Route component={this.lazyView("_NotFound")} />
					</Switch>
				</Suspense>
			</Router>
		);
	}
}
