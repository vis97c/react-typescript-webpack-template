/** @format*/

import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

export default class NotFound extends Component<{}, {}> {
	//react state
	// state = {};
	// myMethod = () => {};
	render() {
		return (
			<div className="wrapper">
				<h1>404</h1>
				<h2>Not found route</h2>
			</div>
		);
	}
}
