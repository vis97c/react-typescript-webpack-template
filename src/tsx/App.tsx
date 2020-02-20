/** @format*/

import React, { Component } from "react";
import Views from "./router";
import { Link, NavLink } from "react-router-dom";
// import Mouse from "_reactIcons/Mouse";

// interface ObjectLiteral {
// 	[key: string]: any;
// }
// let data: ObjectLiteral = {
// 	hello: "world",
// 	goodbye: 1,
// };

export default class App extends Component<
	{
		message: String; //these are your props
	},
	{
		value: String; //these are your state
	}
> {
	//react state
	state = {
		value: "this is your content" as string,
	};
	myMethod = () => {
		// this is a react method
		this.setState({ value: "this is other text" });
	};
	render() {
		return (
			<div id="appex">
				{/* <Mouse /> */}
				<h1>Hello, world!</h1>
				<h2>{this.state.value}</h2>
				<button onClick={this.myMethod}>change text</button>
				<p>{this.props.message}</p>
				<Views />
			</div>
		);
	}
}
