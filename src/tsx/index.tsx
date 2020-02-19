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

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

ReactDOM.render(<App />, document.querySelector("#appex"));
