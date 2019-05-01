import React, { useState, useEffect, useCallback, useRef } from 'react';

const App = () => {
  const box = useRef(null)

  const [isActive, setIsActive] = useState(false);
  let refIsActive = useRef(isActive);
  const [angle, setAngle] = useState(0);
  let refAngle = useRef(angle);
  const [startAngle, setStartAngle] = useState(0);
  let refStartAngle = useRef(startAngle);
  const [currentAngle, setCurrentAngle] = useState(0);
  let refCurrentAngle = useRef(currentAngle);
  const [boxCenterPoint, setBoxCenterPoint] = useState({});
  let refBoxCenterPoint = useRef(boxCenterPoint);

  useEffect(() => {
    refIsActive.current = isActive;
    refAngle.current = angle;
    refStartAngle.current = startAngle;
    refCurrentAngle.current = currentAngle;
    refBoxCenterPoint.current = boxCenterPoint;
  });

  // to avoid unwanted behaviour, deselect all text
  const deselectAll = () => {
    if (document.selection) {
      document.selection.empty();
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }

  // method to get the positionof the pointer event relative to the center of the box
  const getPositionFromCenter = e => {
    const fromBoxCenter = {
      x: e.clientX - refBoxCenterPoint.current.x,
      y: -(e.clientY - refBoxCenterPoint.current.y)
    };
    return fromBoxCenter;
  }

  const mouseDownHandler = e => {
    e.stopPropagation();
    const fromBoxCenter = getPositionFromCenter(e);
    const newStartAngle =
      90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
    setStartAngle(newStartAngle);
    setIsActive(true);
  }

  const mouseUpHandler = e => {
    deselectAll();
    e.stopPropagation();
    if (refIsActive.current) {
      const newCurrentAngle = refCurrentAngle.current + (refAngle.current - refStartAngle.current);
      setIsActive(false);
      setCurrentAngle(newCurrentAngle);
    }
  }

  const mouseMoveHandler = e => {
    if (refIsActive.current) {
      const fromBoxCenter = getPositionFromCenter(e);
      const newAngle =
        90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
      box.current.style.transform =
        "rotate(" +
        (refCurrentAngle.current + (newAngle - (refStartAngle.current ? refStartAngle.current : 0))) +
        "deg)";
      setAngle(newAngle)
    }
  }

  useEffect(() => {
    if (box.current) {
      const boxPosition = box.current.getBoundingClientRect();
      // get the current center point
      const boxCenterX = boxPosition.left + boxPosition.width / 2;
      const boxCenterY = boxPosition.top + boxPosition.height / 2;

      // update the state
      setBoxCenterPoint({ x: boxCenterX, y: boxCenterY });
    }

    // in case the event ends outside the box
    window.onmouseup = mouseUpHandler;
    window.onmousemove = mouseMoveHandler;
  }, [])

  return (
    <div className="box-container">
      <div
        className="box"
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        ref={box}
      >
        Rotate
      </div>
    </div>
  );
}

export default App;
