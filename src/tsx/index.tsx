/** @format */
/* globals*/
// Log message
console.log(
	"%c###%c Made with ❤ using React.js\n%c##%c  Developed & mantained by @vis97c\n%c#%c   Get in touch with me on Twitter or GitHub",
	"background:#f1c40f;color:transparent;padding:3px 0",
	"padding:3px 0",
	"background:#2980b9;color:transparent;padding:3px 0",
	"padding:3px 0",
	"background:#e74c3c;color:transparent;padding:3px 0",
	"padding:3px 0"
);

(window as any).$ = (window as any).jQuery = require("jquery");

//main app styles
import "_scss/main.scss";

import React from "react"; // eslint-disable-line no-unused-vars
import ReactDOM from "react-dom";

// import "./compiled-icons";
require("./compiled-icons");
// Object.entries(svgicons).forEach(
// 	([name, exported]: any) => (window[name] = exported)
// );

import App from "./App"; // eslint-disable-line no-unused-vars

ReactDOM.render(
	<App message="esto es un mensaje de prop" />,
	document.getElementById("root")
);
