import React, { useCallback, useRef, useEffect, forwardRef, memo } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { ImageComp } from './ImageComponen'
import { debounce, scrollTo } from './utils';
import { TOTAL_COLUMN, TOTAL_ROW, INITIAL_COLUMN,
    INITIAL_ROW, ITEM_HEIGHT, ITEM_WIDTH, PADDING,
    LEFT, RIGHT, UP, DOWN, PREVENT_SCROLL, DEBOUNCE_TIME } from './consts';

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

const Cell = memo(({ columnIndex, rowIndex, style }) => {
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

const innerElementType = forwardRef(({ style, ...rest }, ref) => (
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
  const gridRef = useRef();
  const wrapperRef = useRef();

  const onFocus = e => {
    const { left, right, top, bottom } = e.target.getBoundingClientRect();
    const { current: { _outerRef: { scrollTop, scrollLeft } } } = gridRef;
    if (prevkey === 83 && bottom >= window.innerHeight) {
      const to = (bottom - window.innerHeight) + scrollTop;
      scrollTo(gridRef.current._outerRef, to, 1000, true);
    } else if (prevkey === 87 && top <= 0) {
      const to = scrollTop - Math.abs(top);
      scrollTo(gridRef.current._outerRef, to, 1000, true);
    } else if (prevkey === 68 && right >= wrapperRef.current.offsetWidth) {
      const to = (right - wrapperRef.current.offsetWidth) + scrollLeft;
      scrollTo(gridRef.current._outerRef, to, 1000, false);
    } else if (prevkey === 65 && left <= 0) {
      const to = scrollLeft - Math.abs(left);
      scrollTo(gridRef.current._outerRef, to, 1000, false);
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

  const debounceKeyDown = useCallback(debounce(onKeyDown, DEBOUNCE_TIME), []);

  const setFocusToElement = (el) => {
    if (el) {
      el.focus(PREVENT_SCROLL);
    }
  }

  const setFocus = (direction) => {
    if (direction === LEFT) {
        setFocusToElement(document.activeElement.previousSibling);
    } else if (direction === RIGHT) {
        setFocusToElement(document.activeElement.nextSibling);
    } else if (direction === UP) {
        const [row, column] = document.activeElement.id.split(":");
        setFocusToElement(document.getElementById(`${+row - 1}:${column}`));
    } else {
        const [row, column] = document.activeElement.id.split(":");
        setFocusToElement(document.getElementById(`${+row + 1}:${column}`));
    }
  }

  useEffect(() => {
    gridRef.current.scrollToItem({
      align: "start",
      columnIndex: INITIAL_COLUMN,
      rowIndex: INITIAL_ROW
    });
    setTimeout(() => {
      document.getElementById(`${INITIAL_ROW}:${INITIAL_COLUMN}`).focus(PREVENT_SCROLL);
    }, 500)
  }, []);
  return (
    <div onFocus={onFocus} onKeyDown={debounceKeyDown} ref={wrapperRef}>
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
