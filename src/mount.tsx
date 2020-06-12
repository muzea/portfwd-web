import React from "react";
import { render } from "react-dom";
import moment from "moment";
import APP from "./App";
import "./style.css";

console.log(moment().format('YYYY'))

render(<APP />, document.querySelector("#app"));
