<<<<<<< HEAD
import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function Sparkline({ data = [1,2,3,4,5] }) {
  return (
    <div className="sparkline">
      <Sparklines data={data} svgWidth={120} svgHeight={40}>
        <SparklinesLine />
      </Sparklines>
    </div>
  );
}
=======
// frontend/src/components/Sparkline.jsx
import { Sparklines, SparklinesLine } from "react-sparklines";

export default function Sparkline({ data = [5,10,5,20,8,15], height = 40 }) {
  return (
    <Sparklines data={data} height={height}>
      <SparklinesLine style={{ fill: "rgba(0,255,255,0.12)" }} color="#00f2ff" />
    </Sparklines>
  );
}
>>>>>>> 2dc515a (Updated Mad)
