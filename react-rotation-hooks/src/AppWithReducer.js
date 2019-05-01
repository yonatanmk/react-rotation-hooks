import React, { useRef, useEffect, useCallback, useReducer } from 'react';

const App = () => {
  const box = useRef(null)

  // const [isActive, setIsActive] = useState(false);
  // const [angle, setAngle] = useState(0);
  // const [startAngle, setStartAngle] = useState(0);
  // const [currentAngle, setCurrentAngle] = useState(0);
  // const [boxCenterPoint, setBoxCenterPoint] = useState({});

  const [state, dispatch] = useReducer(reducer, initialState);
  const { isActive, startAngle, currentAngle, boxCenterPoint } = state;

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
  }, [ boxCenterPoint ])

  const mouseDownHandler = e => {
    e.stopPropagation();
    const fromBoxCenter = getPositionFromCenter(e);
    const newStartAngle =
      90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
    dispatch({ type: 'setStartAngle', payload: newStartAngle})
    // setStartAngle(newStartAngle);
    dispatch({ type: 'setIsActive', payload: true})
    // setIsActive(true);
  }

  const mouseUpHandler = useCallback(e => {
    deselectAll();
    e.stopPropagation();
    if (isActive) {
      // const newCurrentAngle = currentAngle + (angle - startAngle);
      dispatch({ type: 'setIsActive', payload: false })
      // setIsActive(false);
      dispatch({ type: 'setNewCurrentAngle' })
      // setCurrentAngle(newCurrentAngle);
    }
  }, [ isActive ])

  const mouseMoveHandler = useCallback(e => {
    if (isActive) {
      const fromBoxCenter = getPositionFromCenter(e);
      const newAngle =
        90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
      box.current.style.transform =
        "rotate(" +
        (currentAngle + (newAngle - (startAngle ? startAngle : 0))) +
        "deg)";
      dispatch({ type: 'setAngle', payload: newAngle})
      // setAngle(newAngle)
    }
  }, [box, isActive, currentAngle, startAngle, getPositionFromCenter])

  useEffect(() => {
    if (box.current) {
      const boxPosition = box.current.getBoundingClientRect();
      // get the current center point
      const boxCenterX = boxPosition.left + boxPosition.width / 2;
      const boxCenterY = boxPosition.top + boxPosition.height / 2;

      // update the state
      dispatch({ type: 'setBoxCenterPoint', payload: { x: boxCenterX, y: boxCenterY } })
      // setBoxCenterPoint({ x: boxCenterX, y: boxCenterY });
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
        ref={box}
      >
        Rotate
      </div>
    </div>
  );
}

const initialState = {
  box: null,
  isActive: false,
  angle: 0, 
  startAngle: 0, 
  currentAngle: 0, 
  boxCenterPoint: {},
};

function reducer(state, action) {
  const { angle, startAngle, currentAngle } = state;
  if (action.type === 'setIsActive') {
    return { ...state, isActive: action.payload };
  } else if (action.type === 'setAngle') {
    return { ...state, angle: action.payload };
  } else if (action.type === 'setStartAngle') {
    return { ...state, startAngle: action.payload };
  } else if (action.type === 'setCurrentAngle') {
    return { ...state, currentAngle: action.payload };
  } else if (action.type === 'setNewCurrentAngle') {
    const newCurrentAngle = currentAngle + (angle - startAngle);
    return { ...state, currentAngle: newCurrentAngle };
  } else if (action.type === 'setBoxCenterPoint') {
    return { ...state, boxCenterPoint: action.payload };
  } else {
    throw new Error();
  }
}

export default App;
