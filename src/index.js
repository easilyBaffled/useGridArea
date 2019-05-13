import React from "react";
import ReactDOM from "react-dom";
import cs from "console.tap";

import "./styles.css";
console = cs;
/*
 * @returns { 
      GridArea: ReactComponent, 
      directives: { [areaName: string]: { style: { gridArea: [areaName: string] }  } },
      areas: { [areaName: string]: ReactComponent }
   }
 * @example 
  const { GridArea, directives, areas } = useGridArea( `
    a a a
    s b b
    s b b
  ` )
*/
const useGridArea = areaString => {
  const areaNames = Array.from(
    new Set(
      areaString
        .trim()
        .replace(/\n/g, "")
        .split(" ")
    )
  ).filter(v => v);

  var res = {
    GridArea: ({ style, ...props }) => (
      <span
        style={{
          display: "grid",
          gridTemplateAreas: areaString
            .split("\n")
            .filter(v => v)
            .map(s => `"${s.trim()}"`)
            .join(" "),
          ...style
        }}
        {...props}
      />
    )
  };
  Object.defineProperty(res, "directive", {
    get() {
      const createGridArea = gridArea => {
        const s = styles => ({
          style: {
            gridArea,
            ...styles
          }
        });
        s[Symbol.iterator] = () => s();
        return s;
      };
      return areaNames.reduce(
        (acc, gridArea) => ({ ...acc, [gridArea]: createGridArea(gridArea) }),
        {}
      );
    }
  });
  Object.defineProperty(res, "areas", {
    get() {
      return areaNames.reduce(
        (acc, gridArea) => ({
          ...acc,
          [gridArea.replace(/^(\w)/, $1 => $1.toUpperCase())]: ({
            style,
            ...props
          }) => <span style={{ gridArea, ...style }} {...props} />
        }),
        {}
      );
    }
  });
  return res;
};

const Box = ({ m, margin = m, style, ...props }) => (
  <div style={{ margin, ...style }} {...props} />
);

function App() {
  const {
    GridArea,
    areas: { A, S, B },
    directive: { a, s, b }
  } = useGridArea(`
  a a a
  s b b
  s b b
`);

  const aBackground = { background: "rgba(255, 255, 255, 0.3)" };
  const sBackground = { background: "rgba(255, 255, 255, 0.5)" };
  const bBackground = { background: "rgba(255, 255, 255, 0.7)" };

  return (
    <div className="App">
      <Box m={10}>
        <GridArea style={{ background: "tomato", height: 200, width: 200 }}>
          <A style={aBackground}>A</A>
          <S style={sBackground}>S</S>
          <B style={bBackground}>B</B>
        </GridArea>
      </Box>
      <Box m={10}>
        <GridArea style={{ background: "tomato", height: 200, width: 200 }}>
          <div {...a(aBackground)}>a</div>
          <div {...s(sBackground)}>s</div>
          <div {...b(bBackground)}>b</div>
        </GridArea>
      </Box>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
