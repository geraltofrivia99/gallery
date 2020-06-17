import React from 'react';
import { fetchImageData } from './api'
import './styles.css';
import Fade from './Fade';

const cacheCells = {};
const cacheImage = {}

let curArr = null;
let prevTop = 0;
let prevLeft = 0;
const visibleCells = Math.floor(window.innerWidth / 300) + 1;
const rowHeight = 200;
const visibleRows = Math.floor(window.innerHeight / rowHeight) + 1;
let focusedElement = null;
let gridCoords = {right: 0, bottom: 0}
let prevKey = null;

let xCounter = 0;
let ranged = {left: 0, right: 19, top: 0, bottom: 14};
let active = {col: 0, row: 0}
let toScroll = 0;
let wasAdded = 0;

const initialData = makeTableData(20, 15);

const ImageComponent = React.memo(({ src }) => {
  React.useEffect(() => {

  })
  return <img className="image" src={src}/>
});


const Cell = React.memo(({ src, isActive, realId, row, col, promise } ) => {
    const cn = `cell ${isActive ? 'active-cell' : ''}`
    const [load, setLoad] = React.useState(false);
    // React.useEffect(() => {
    //   if (!cacheImage[src]) {
    //     const image = new Image(300, 200);
    //     image.onload = () => {
    //       cacheImage[src] = src;
    //       setLoad(true);
    //     };
    //     image.onerror = () => setLoad(false);
    //     image.src = src;
    //   }
    // }, [src]);
    return (
      <div id={realId} className={cn} tabIndex={0}>
        <div style={{ position: 'absolute', top: '5px', left: '5px' }}>row: {row} col: {col}</div>
        {true ?  <ImageComponent src={src} /> : <div className="image-placeholder"/>}
      </div>
    )
})

export function Gridd() {
  const rootRef = React.useRef();

  const [start, setStart] = React.useState(0);
  const [xstart, setXStart] = React.useState(0);
  const [data, setData] = React.useState(initialData);
  const [activeCell, setActiveCell] = React.useState({ row: 0, col: 0 });
  
  
function getRightWidth() {
    return 300 * xstart;
  }
  function getLeftWidth() {
    return 300 * (data[0].length - (xstart + visibleCells + 1)); ///dsadsa
  }
  
  function getTopHeight() {
    return rowHeight * start;
  }
  function getBottomHeight() {
    return rowHeight * (data.length - (start + visibleRows + 1));
  }

  function onScroll(e) {
    if (prevTop !== e.target.scrollTop) { 
        const next = Math.floor(e.target.scrollTop / rowHeight);
        setStart(next);
        prevTop = e.target.scrollTop;
    } else if (prevLeft !== e.target.scrollLeft) {
        const a = Math.floor(e.target.scrollLeft / 300); 
        setXStart(a);
        prevLeft = e.target.scrollLeft;
    }
  }
  // const thScroll = throttle(onScroll, 100);
  
  React.useEffect(() => {
    gridCoords.right = rootRef.current.offsetWidth;
    document.scrollTop = 0;
    // gridCoords.bottom = rootRef.current.offsetHeight;
    gridCoords.bottom = window.innerHeight;
    rootRef.current.scrollTo({ top: 0, left: 0 })
    focusedElement = rootRef.current.childNodes[1].childNodes[0].getElementsByClassName('celltd')[0];
    focusedElement.focus({preventScroll:true});
    rootRef.current.addEventListener('scroll', onScroll);

    return () => {
      rootRef.current.removeEventListener('scroll', onScroll);
    }
  }, [visibleRows, rowHeight]);
  
  const renderCell = (image, rowIndex, col, promise) => {
    if (!cacheCells[image]) {
        cacheCells[image] = (<Cell key={image} src={image} row={rowIndex} realId={`${rowIndex}:${col}`} col={col} isActive={col === activeCell.col && rowIndex === activeCell.row} />)
        return cacheCells[image];
    }
    return cacheCells[image]; ///ds
  }
  
  function onKeyDown(e) { //dsa
    e.preventDefault();
    e.stopPropagation();
    // const [ row, col ] = document.activeElement.id.split('');
    prevKey = e.keyCode;
    if (e.keyCode == 87) { //up
      active.row = active.row === 0 ? 14 : active.row - 1;
      // console.log(active.row, ranged.top)
      if (active.row === ranged.top) {
        console.log('setVertical')
        // setVertical('up');
      }
      setFocus('up');
    } else if (e.keyCode == 83) { //down
      active.row = active.row === 14 ? 0 : active.row + 1;
      // console.log(active.row, row);
      // if (+row === visibleRows - 2) {
      //   setVertical('down');
      // }
      console.log(active.row, ranged.bottom, ranged.top);
      if (active.row === ranged.bottom) {
        // setVertical('down');
      }
      setFocus('down');
    } else if (e.keyCode == 65) { //left
      setFocus('left');
      const newActiveCell = { ...activeCell, col: activeCell.col === 0 ? 19 : activeCell.col - 1 }
      setActiveCell(newActiveCell);
    } else if (e.keyCode == 68) { //right
      active.col = active.col === 19 ? 0 : active.col + 1;
      console.log(active.col, ranged.right)
      if (active.col === ranged.right) {
        console.log('setHorizonta')
        setHorizontal('right')
      }      
      setFocus('right');
      const newActiveCell = { ...activeCell, col: activeCell.col + 1 >= 20 ? 0 : activeCell.col + 1 }
      setActiveCell(newActiveCell);
    }
  }
  
  function setFocus(direction) {
    switch(direction) {
      case 'left':
        document.activeElement.previousSibling.focus({preventScroll:true});
        return;
      case 'right':
        document.activeElement.nextSibling.focus({preventScroll:true});
        return;
      case 'up':
        document.activeElement.parentElement.previousSibling.childNodes[+document.activeElement.id.split('')[1] + 1].focus({preventScroll:true});
        return;
      case 'down':
        document.activeElement.parentElement.nextSibling.childNodes[+document.activeElement.id.split('')[1] + 1].focus({preventScroll:true});
        return;
    }
  }

  
  const setVertical = (direction) => {
    if (direction === 'down') {
      const el = data.shift();
      setData([...data, el]);
      ranged.bottom = ranged.bottom === 14 ? 0 : ranged.bottom + 1;
      ranged.top = ranged.top === 14 ? 0 : ranged.top + 1;
      // setStart(start => start - 1);
      // rootRef.current.scrollTo(rootRef.current.scrollLeft, rootRef.current.scrollTop + 200);
    } else {
      const el = data.pop();
      setData([el, ...data]);
      ranged.bottom = ranged.bottom === 0 ? 14 : ranged.bottom - 1;
      ranged.top = ranged.top === 0 ? 14 : ranged.top - 1;
      rootRef.current.scrollTo(rootRef.current.scrollLeft, rootRef.current.scrollTop + 210);
      // setStart(start => start - 1)
    }
  }

  const setHorizontal = (direction) => {
    if (direction === 'right') {
      for (let i = 0; i < data.length; i++) {
        const el = data[i].shift();
        data[i].push(el);
      }
      // xCounter++;
      ranged.right = ranged.right === 19 ? 0 : ranged.right + 1;
      ranged.left = ranged.left === 19 ? 0 : ranged.tleft + 1;
      setData([...data]);
      rootRef.current.scrollTo(rootRef.current.scrollLeft - 300, rootRef.current.scrollTop);
    } else {
      const el = data.pop();
      setData([el, ...data]);
      // rootRef.current.scrollTo(rootRef.current.scrollLeft, rootRef.current.scrollTop + 200);
    }
}
  
  const onFocus = (e) => {
    e.preventDefault();
    const scrollTop = rootRef.current.scrollTop;
    const scrollLeft = rootRef.current.scrollLeft;
    const {left, right, top, bottom} = e.target.getBoundingClientRect();
    const nextStart = Math.floor(rootRef.current.scrollTop / rowHeight);
    const nextXStart = Math.floor(rootRef.current.scrollLeft / 300); 
    if (prevKey === 68 && right >= gridCoords.right) {
      // setXStart(nextXStart);
      rootRef.current.scrollTo({ left: scrollLeft + (right - gridCoords.right) + 300, behavior: 'smooth' })
    } else if (prevKey === 65 && left <= 0) {
        // setXStart(nextXStart);
        rootRef.current.scrollTo({ left: scrollLeft - 300, behavior: 'smooth' })
    } else if (prevKey === 87) {
        const newActiveCell = { ...activeCell, row: +e.target.childNodes[0].id.split(':')[0] }
        setActiveCell(newActiveCell);
      if (top <= 0) {
        // setStart(nextStart);
        rootRef.current.scrollTo({ top: scrollTop - 200, behavior: 'smooth' });
      }
    } else if (prevKey === 83) {
        const newActiveCell = { ...activeCell, row: +e.target.childNodes[0].id.split(':')[0] }
        setActiveCell(newActiveCell);
        console.log(bottom, gridCoords.bottom, 'bottom')
      if (bottom >= gridCoords.bottom) {
        console.log(bottom >= gridCoords.bottom, 'zawli')
        // setStart(nextStart);
        // toScroll = scrollTop + 200;
        // console.log(scrollTop + 200, 'toScroll')
        rootRef.current.scrollTo({ top: scrollTop + 200, behavior: 'smooth' });
      }
    }
  }

  // function isVisibleCol(col) {
  //   return col >= xstart && col <= xstart + visibleCells + 1;
  // }
  // function isVisibleRow(row) {
  //   return row >= start && row <= start + visibleRows + 1;
  // }
  
  return (
   <div className="absolte-wrapper">
      <div className='rootEl' style={{ height: window.innerHeight + 200, overflow: 'auto' }} ref={rootRef} onKeyUp={onKeyDown} tabIndex={0} onFocus={onFocus} tabIndex={0}>
      <div style={{ height: getTopHeight() }} />
          <div className="grid">
            {data.slice(start, start + visibleRows + 1).map((row, rowIndex) => (
              <div className="row"
                // show={rowIndex + 1 >= start && rowIndex + 1 <= start + visibleRows + 1}
                key={row[0].rowNumber}
              ><div style={{ width: getRightWidth() }} />
                {row.slice(xstart, xstart + visibleCells + 1).map(({ image, cell, rowNumber, promise }, colIndex) => (
                <div className="celltd" id={`${rowIndex}${colIndex}`} key={image} tabIndex={0}>
                  <Cell key={image} src={image} row={rowNumber} realId={`${rowNumber}:${cell}`} col={cell}
                    isActive={cell === activeCell.col && rowNumber === activeCell.row}/>
                  {/* {renderCell(image, rowNumber, cell, promise)} */}
                </div>
              ))}<div style={{ width: getLeftWidth() }} /></div>
            ))}
          </div>
      <div style={{ height: getBottomHeight() }} />  
      <div style={{ position: "absolute", bottom: 0 }} onClick={() => console.log(start)}>start</div>
    </div>
   </div>
  )
}

function makeTableData(w, h) {
  let i = 1;
  return new Array(h).fill(0).map((_, rowIndex) => {
    return new Array(w).fill(0).map((_, colIndex) => {
      return {
          image: `https://picsum.photos/id/${i++}/300/200`,
          cell: colIndex,
          rowNumber: rowIndex,
          // prefetchedImage: fetchImageData(`https://i.picsum.photos/id/${i++}/300/200.jpg`)
      };
    });
  });
}

  function throttle(func, ms) {

    let isThrottled = false,
      savedArgs,
      savedThis;
  
    function wrapper() {
  
      if (isThrottled) { 
        savedArgs = arguments;
        savedThis = this;
        return;
      }
  
      func.apply(this, arguments);
  
      isThrottled = true;
  
      setTimeout(function() {
        isThrottled = false;
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }
  
    return wrapper;
  }