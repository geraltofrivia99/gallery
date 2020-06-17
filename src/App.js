import React from 'react';
import { Grid } from './components';

import './App.css';

const data = ((w = 20, h = 15) => {
  let i = 1;
  return new Array(h).fill(0).map((_, rowIndex) => {
    return new Array(w).fill(0).map((_, colIndex) => {
      return {
        image: `https://picsum.photos/id/${i++}/300/200`,
        cell: colIndex,
        rowNumber: rowIndex
      };
    });
  });
})();

function App() {
  return (
    <Grid data={data} />
  );
}

export default App;

