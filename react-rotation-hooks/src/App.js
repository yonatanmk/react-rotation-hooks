import React, { useState, useEffect, useCallback, useRef } from 'react';

// const App = () => {
//   const [box, setBox] = useState(null);

//   const [isActive, setIsActive] = useState(false);
//   let refIsActive = useRef(isActive);
//   const [angle, setAngle] = useState(0);
//   let refAngle = useRef(angle);
//   const [startAngle, setStartAngle] = useState(0);
//   let refStartAngle = useRef(startAngle);
//   const [currentAngle, setCurrentAngle] = useState(0);
//   let refCurrentAngle = useRef(currentAngle);
//   const [boxCenterPoint, setBoxCenterPoint] = useState({});
//   let refBoxCenterPoint = useRef(boxCenterPoint);

//   useEffect(() => {
//     refIsActive.current = isActive;
//     refAngle.current = angle;
//     refStartAngle.current = startAngle;
//     refCurrentAngle.current = currentAngle;
//     refBoxCenterPoint.current = boxCenterPoint;
//   });

//   const setBoxCallback = useCallback(node => {
//     if (node !== null) {
//       setBox(node)
//     }
//   }, [])

//   // to avoid unwanted behaviour, deselect all text
//   const deselectAll = () => {
//     if (document.selection) {
//       document.selection.empty();
//     } else if (window.getSelection) {
//       window.getSelection().removeAllRanges();
//     }
//   }

//   // method to get the positionof the pointer event relative to the center of the box
//   const getPositionFromCenter = e => {
//     const fromBoxCenter = {
//       x: e.clientX - refBoxCenterPoint.current.x,
//       y: -(e.clientY - refBoxCenterPoint.current.y)
//     };
//     return fromBoxCenter;
//   }

//   const mouseDownHandler = e => {
//     e.stopPropagation();
//     const fromBoxCenter = getPositionFromCenter(e);
//     const newStartAngle =
//       90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
//     setStartAngle(newStartAngle);
//     setIsActive(true);
//   }

//   const mouseUpHandler = e => {
//     deselectAll();
//     e.stopPropagation();
//     if (refIsActive.current) {
//       const newCurrentAngle = refCurrentAngle.current + (refAngle.current - refStartAngle.current);
//       setIsActive(false);
//       setCurrentAngle(newCurrentAngle);
//     }
//   }

//   const mouseMoveHandler = e => {
//     if (refIsActive.current) {
//       const fromBoxCenter = getPositionFromCenter(e);
//       const newAngle =
//         90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
//       box.style.transform =
//         "rotate(" +
//         (refCurrentAngle.current + (newAngle - (refStartAngle.current ? refStartAngle.current : 0))) +
//         "deg)";
//       setAngle(newAngle)
//     }
//   }

//   useEffect(() => {
//     if (box) {
//       const boxPosition = box.getBoundingClientRect();
//       // get the current center point
//       const boxCenterX = boxPosition.left + boxPosition.width / 2;
//       const boxCenterY = boxPosition.top + boxPosition.height / 2;

//       // update the state
//       setBoxCenterPoint({ x: boxCenterX, y: boxCenterY });
//     }

//     // in case the event ends outside the box
//     window.onmouseup = mouseUpHandler;
//     window.onmousemove = mouseMoveHandler;
//   }, [ box ])

//   return (
//     <div className="box-container">
//       <div
//         className="box"
//         onMouseDown={mouseDownHandler}
//         onMouseUp={mouseUpHandler}
//         ref={setBoxCallback}
//       >
//         Rotate
//       </div>
//     </div>
//   );
// }

const App = () => {
  const [box, setBox] = useState(null);

  const [isActive, setIsActive] = useState(false);
  const [angle, setAngle] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [boxCenterPoint, setBoxCenterPoint] = useState({});

  const setBoxCallback = useCallback(node => {
    if (node !== null) {
      setBox(node)
    }
  }, [])

  // to avoid unwanted behaviour, deselect all text
  const deselectAll = () => {
    if (document.selection) {
      document.selection.empty();
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }

  // method to get the positionof the pointer event relative to the center of the box
  const getPositionFromCenter = useCallback(e => {
    const fromBoxCenter = {
      x: e.clientX - boxCenterPoint.x,
      y: -(e.clientY - boxCenterPoint.y)
    };
    return fromBoxCenter;
  }, [boxCenterPoint])

  const mouseDownHandler = e => {
    e.stopPropagation();
    const fromBoxCenter = getPositionFromCenter(e);
    const newStartAngle =
      90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
    setStartAngle(newStartAngle);
    setIsActive(true);
  }

  const mouseUpHandler = useCallback(e => {
    deselectAll();
    e.stopPropagation();
    if (isActive) {
      const newCurrentAngle = currentAngle + (angle - startAngle);
      setIsActive(false);
      setCurrentAngle(newCurrentAngle);
    }
  }, [isActive, angle, currentAngle, startAngle])

  const mouseMoveHandler = useCallback(e => {
    if (isActive) {
      const fromBoxCenter = getPositionFromCenter(e);
      const newAngle =
        90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
      box.style.transform =
        "rotate(" +
        (currentAngle + (newAngle - (startAngle ? startAngle : 0))) +
        "deg)";
      setAngle(newAngle)
    }
  }, [box, isActive, currentAngle, startAngle, getPositionFromCenter])

  useEffect(() => {
    if (box) {
      const boxPosition = box.getBoundingClientRect();
      // get the current center point
      const boxCenterX = boxPosition.left + boxPosition.width / 2;
      const boxCenterY = boxPosition.top + boxPosition.height / 2;

      // update the state
      setBoxCenterPoint({ x: boxCenterX, y: boxCenterY });
    }
  }, [ box ])

  useEffect(() => {
    // in case the event ends outside the box
    window.onmouseup = mouseUpHandler;
    window.onmousemove = mouseMoveHandler;
  }, [mouseUpHandler, mouseMoveHandler])

  return (
    <div className="box-container">
      <div
        className="box"
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        ref={setBoxCallback}
      >
        Rotate
      </div>
    </div>
  );
}

export default App;
