import React, { Component, useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import ManagerOptions from "./ManagerOptions";

import Body from "./Body";

function App() {
  return (
    <div className="App">
      <Header />
      {/* <ManagerOptions /> */}
      <Body />
    </div>
  );
}

export default App;
