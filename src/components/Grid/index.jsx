import React, { useState, useEffect, useRef } from 'react';
import './styles.css'
import RowObserver from './hook';

let row = 1;
let visibleRows = 3;


const ImageComp = React.memo(({ src, i }) => {
    const [loading, setLoading] = useState(false);
    // console.log(src)
    useEffect(() => {
        const img = new Image(300, 200);
        img.src = src;
        img.onload = () => setLoading(true);
        img.onerror = () => setLoading(false);
    }, [src])
    if (loading) {
        return (<img className="image" src={src} alt="img" />)
    }
    return <div>Loading...</div>
})

// const Row = React.memo(({  }) => {

// })

const Cell = React.memo(({ position, src, isActive, id } ) => {
    const cn = `cell ${isActive ? 'active-cell' : ''}`
    return (
        <div id={id} className={cn} style={{ left: position }} tabIndex={0}>
            {/* <ImageComp src={src} /> */}
            {src}
        </div>
    )
})

let isNeedRemove = null;
let gridRect = { right: null, bottom: null };
let maxPosition = 0;
let minPosition = 0;
let sideDirection = 0;
let changedIndexes = 0;
let inversionChangedIndexes = 19;
let activeArrow = null;

export const Grid = React.memo(() => {
    const [data, setData] = useState(makeTableData(20, 15));
    // const [setRef, visible] = RowObserver({ rootMargin: '0px' }, addRow);
    const rootRef = useRef(null);
    const [activeCell, setActiveCell] = useState({ row: 0, col: 3, pos: 600 });
    const [translateX, setTranslateX] = useState(-600);
    const [translateY, setTranslateY] = useState(0);
    const [start, setStart] = React.useState(0);
    
    const keyDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'ArrowRight') {
            activeArrow='right'
            sideDirection++;
            const newActiveCell = { ...activeCell, col: activeCell.col + 1 >= 20 ? 0 : activeCell.col + 1 }
            setActiveCell(newActiveCell);
            console.log('FOCUSON', newActiveCell.col);
            setFocus(newActiveCell.row, newActiveCell.col);
        } else if (e.key === 'ArrowLeft') {
            sideDirection--;
            activeArrow='left'
            const newActiveCell = { ...activeCell, col: activeCell.col === 0 ? 19 : activeCell.col - 1 }
            console.log('FOCUSON', newActiveCell.col)
            setActiveCell(newActiveCell);
            setFocus(newActiveCell.row, newActiveCell.col);
        } else if (e.key === 'ArrowDown') {
            activeArrow='down'
            const newActiveCell = { ...activeCell, row: activeCell.row + 1 }
            console.log('FOCUSON', newActiveCell.col)
            setActiveCell(newActiveCell);
            // if (newActiveCell) {

            // }
            setFocus(newActiveCell.row, newActiveCell.col);

            // window.scrollTo({ top: row * 300, behavior: 'smooth' });
            // addRow();
            // row++;
        } else if (e.key === 'ArrowUp') {
            activeArrow='up'
            const newActiveCell = { ...activeCell, row: activeCell.row - 1 }
            console.log('FOCUSON', newActiveCell.col)
            setActiveCell(newActiveCell);
            setFocus(newActiveCell.row, newActiveCell.col);
            // row--;
            // removeRow();
            // window.scrollTo({ top: (row - 1) * 300, behavior: 'smooth' });
        }

    }

    function getTopHeight() {
        return 200 * start;
      }
      function getBottomHeight() {
        return 200 * (data.length - (start + visibleRows + 1));
      }

    const firstToLast = (data) => {
        for (let i = 0; i < data.length; i++) {
            // const lastPos = data[i][data[i].length - 1].position;
            data[i][changedIndexes].position = maxPosition + 300;
        }
        if (changedIndexes === 19) {
            changedIndexes = 0;
        } else {
            changedIndexes++
        }
        maxPosition += 300;
        minPosition +=300;
        return data;
    }
    const LastToFirst = (data) => {
        for (let i = 0; i < data.length; i++) {
            data[i][inversionChangedIndexes].position = minPosition - 300;
        }
        if (inversionChangedIndexes === 0) {
            inversionChangedIndexes = 19;
        } else {
            inversionChangedIndexes--
        }
        minPosition = minPosition - 300;
        maxPosition -= 300;
        return data;
    }
    const getTemplateColumns = () => {
        return 'repeat(20, 300px)';
    }
    const getTemplateRows = () => {
        return `repeat(${data.length}, 200px)`;
    }
    useEffect(() => {
        maxPosition = (data[0].length - 1) * 300;
        const { right } = rootRef.current.getBoundingClientRect();
        gridRect.right = right;
        gridRect.bottom = window.innerHeight;
        // setFocus(0, 3);
        // getImages().then(res => console.log(res))
        // document.addEventListener('scroll', onScroll)
        return () => {
            // document.removeEventListener('scroll', onScroll)
        }
    }, [])

    function setFocus(row, col) {
        rootRef.current.childNodes[row].childNodes[0].childNodes[col].focus({preventScroll:true});
    }

    function addRow() {
        const el = data.shift();
        console.log('remove')

        setData([...data, el]);
    }
    function removeRow() {
        const el = data.pop();
        setData([el, ...data])
    }

    function onScroll(e) {
        // console.log('start')
        console.log(Math.floor(e.target.scrollTop / 200));
        setStart(Math.floor(e.target.scrollTop / 200))
    }

    function onFocus(e) {
        const {left, right, top, bottom} = e.target.getBoundingClientRect();
        // const scrollLeft = rootRef.current.scrollLeft;
        if (activeArrow === 'right' && right >= gridRect.right) {
            const a = parseInt(e.target.style.left);
            if (a + 600 > maxPosition) {
                const newData = [...firstToLast(data)];
                setData(newData);
            }
            setTranslateX(translateX - ((right - gridRect.right) + 300));
            // rootRef.current.scrollTo({ left: scrollLeft + (right - gridRect.right), behavior: 'smooth' });
        } else if (activeArrow === 'left' && left <= 0) {
            if (parseInt(e.target.style.left) - 300 <= minPosition) {
                const newData = [...LastToFirst(data)];
                setData(newData);
            }
            setTranslateX(translateX + 300);
            // rootRef.current.scrollTo({ left: scrollLeft + left, behavior: 'smooth' });
        } else if (activeArrow === 'down' && bottom >= gridRect.bottom) {
            // if () {
            //     setStart(Math.floor(e.target.scrollTop / 200))
            // }
            // setTranslateY(translateY - (bottom - gridRect.right + 100))
        } else if (activeArrow === 'up' && top <= 0) {
            // setTranslateY(translateY + 200)
        }
    }

    function getCurentTranslate() {
        return  `translate3d(${ translateX }px, 0px, 0px)`;
    }
   
    return (
        <>
        <div className="grid"
        style={{ transform: getCurentTranslate(), height: 200 * visibleRows + 1, }}
        ref={rootRef} onKeyDown={keyDown} onFocus={onFocus} onScroll={onScroll}>
            <div style={{ height: getTopHeight() }} />
            {data.slice(start, start + visibleRows + 2).map((row, rowIndex) => (
                    <div
                        className="row"
                        style={{ height: '200px' }}
                        key={row[0].image}
                    >
                        {row.map(({ image, position }, col) => (
                        <Cell key={image} src={image} id={`${rowIndex}${col}`} row={rowIndex + 1} position={position} isActive={col === activeCell.col && rowIndex === activeCell.row} />))}
                    </div>
                ))}
             <div style={{ height: getBottomHeight() }} />  
           </div>
        </>
    )
})

function makeTableData(w, h) {
    let i = 1;
    return new Array(h).fill(0).map(() => {
      return new Array(w).fill(0).map((_, colIndex) => {
        return {
            image: `https://picsum.photos/id/${i++}/300/200`,
            order: colIndex,
            position: colIndex * 300
        };
      });
    });
  }
