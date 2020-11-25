import React, { useEffect, useState } from "react";
import "./ClickTap.scss";

export default function ClickTap() {
  return (
    <span>
      <span className="click">Click</span>
      <span className="tap">Tap</span>
    </span>
  );
}
