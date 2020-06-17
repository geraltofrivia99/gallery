import React from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { ImageComp } from './ImageComponen'
import { TOTAL_COLUMN, TOTAL_ROW, INITIAL_COLUMN,
    INITIAL_ROW, ITEM_HEIGHT, ITEM_WIDTH, PADDING, LEFT, RIGHT, UP, DOWN } from './consts';

import "./styles.css";


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

const cacheImage = {};
let prevkey = null;

const Cell = React.memo(({ columnIndex, rowIndex, style }) => {
    const trulyRowIndex = rowIndex % data.length;
    const trulyColumnIndex = columnIndex % data[trulyRowIndex].length;
    const { image: dataImage, cell } = data[trulyRowIndex][trulyColumnIndex];
    return (
      <div
        id={"" + rowIndex + ":" + columnIndex}
        tabIndex={0}
        className="cell-inner"
        key={"" + columnIndex + " " + rowIndex}
        style={{
          ...style,
          left: style.left + PADDING,
          top: style.top + PADDING,
          width: style.width - PADDING,
          height: style.height - PADDING
        }}
      >
        <div className="image-container">
          <ImageComp image={dataImage} cacheImage={cacheImage}/>
        </div>
        <div className="details">
          <span className="title">Image number in row: {cell} </span>
          <span className="info">Lorem ...</span>
       </div>
      </div>
    );
  })

const innerElementType = React.forwardRef(({ style, ...rest }, ref) => (
  <div
    ref={ref}
    style={{
      ...style,
      paddingLeft: PADDING,
      paddingTop: PADDING
    }}
    {...rest}
  />
));

 export const GridComp = () => {
  const gridRef = React.useRef();
  const wrapperRef = React.useRef();

  const onFocus = e => {
    const { left, right, top, bottom } = e.target.getBoundingClientRect();
    if (prevkey === 83 && bottom >= window.innerHeight) {
      e.target.scrollIntoView({ behavior: "smooth", block: "end" });
    } else if (prevkey === 87 && top <= 0) {
      e.target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (prevkey === 68 && right >= wrapperRef.current.offsetWidth) {
      e.target.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "end"
      });
    } else if (prevkey === 65 && left <= 0) {
      e.target.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    }
    prevkey = null;
  };
  const onKeyDown = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.keyCode === 87) {
      prevkey = 87;
      setFocus(UP);
    } else if (e.keyCode === 83) {
      //down
      prevkey = 83;
      setFocus(DOWN);
    } else if (e.keyCode === 65) {
      //left
      prevkey = 65;
      setFocus(LEFT);
    } else if (e.keyCode === 68) {
      //right
      prevkey = 68;
      setFocus(RIGHT);
    }
  };

  function setFocus(direction) {
    if (direction === LEFT) {
        const prev = document.activeElement.previousSibling;
        if (prev) {
            prev.focus({ preventScroll: true });
        }
    } else if (direction === RIGHT) {
        const next = document.activeElement.nextSibling;
        if (next) {
            next.focus({ preventScroll: true });
        }
    } else if (direction === UP) {
        const [row, column] = document.activeElement.id.split(":");
        const up = document.getElementById(`${+row - 1}:${column}`);
        if (up) {
            up.focus({ preventScroll: true });
        }
    } else {
        const [row, column] = document.activeElement.id.split(":");
        const down = document.getElementById(`${+row + 1}:${column}`);
        if (down) {
            down.focus({ preventScroll: true });
        }
    }
  }

  React.useEffect(() => {
    gridRef.current.scrollToItem({
      align: "start",
      columnIndex: INITIAL_COLUMN,
      rowIndex: INITIAL_ROW
    });
    setTimeout(() => {
        document.getElementById(`${INITIAL_ROW}:${INITIAL_COLUMN}`).focus({preventScroll: true});
    }, 500)
  }, []);
  return (
    <div onFocus={onFocus} onKeyDown={onKeyDown} ref={wrapperRef}>
      <Grid
        className="Grid"
        columnCount={TOTAL_COLUMN}
        columnWidth={() => ITEM_WIDTH + PADDING}
        height={window.innerHeight}
        innerElementType={innerElementType}
        rowCount={TOTAL_ROW}
        rowHeight={() => ITEM_HEIGHT + PADDING}
        width={window.innerWidth}
        ref={gridRef}
      >
        {Cell}
      </Grid>
    </div>
  );
};
