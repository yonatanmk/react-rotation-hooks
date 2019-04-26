import React, { useState, useEffect, useCallback } from 'react';

// class App extends Component {
//   constructor() {
//     super();

//     this.box = null;

//     this.state = {
//       isActive: false,
//       angle: 0,
//       startAngle: 0,
//       currentAngle: 0,
//       boxCenterPoint: {}
//     };
//     this.getPositionFromCenter = this.getPositionFromCenter.bind(this);
//     this.mouseDownHandler = this.mouseDownHandler.bind(this);
//     this.mouseUpHandler = this.mouseUpHandler.bind(this);
//     this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
//     this.deselectAll = this.deselectAll.bind(this);
//   }

//   componentDidMount() {
//     const boxPosition = this.box.getBoundingClientRect();
//     // get the current center point
//     const boxCenterX = boxPosition.left + boxPosition.width / 2;
//     const boxCenterY = boxPosition.top + boxPosition.height / 2;

//     // update the state
//     this.setState({
//       boxCenterPoint: { x: boxCenterX, y: boxCenterY }
//     });
//     // in case the event ends outside the box
//     window.onmouseup = this.mouseUpHandler;
//     window.onmousemove = this.mouseMoveHandler;
//   }

//   // to avoid unwanted behaviour, deselect all text
//   deselectAll() {
//     if (document.selection) {
//       document.selection.empty();
//     } else if (window.getSelection) {
//       window.getSelection().removeAllRanges();
//     }
//   }

//   // method to get the positionof the pointer event relative to the center of the box
//   getPositionFromCenter(e) {
//     const { boxCenterPoint } = this.state;
//     const fromBoxCenter = {
//       x: e.clientX - boxCenterPoint.x,
//       y: -(e.clientY - boxCenterPoint.y)
//     };
//     return fromBoxCenter;
//   }

//   mouseDownHandler(e) {
//     e.stopPropagation();
//     const fromBoxCenter = this.getPositionFromCenter(e);
//     const newStartAngle =
//       90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
//     this.setState({
//       startAngle: newStartAngle,
//       isActive: true
//     });
//   }

//   mouseUpHandler(e) {
//     this.deselectAll();
//     e.stopPropagation();
//     const { isActive, angle, startAngle, currentAngle } = this.state;
//     if (isActive) {
//       const newCurrentAngle = currentAngle + (angle - startAngle);
//       this.setState({
//         isActive: false,
//         currentAngle: newCurrentAngle
//       });
//     }
//   }

//   mouseMoveHandler(e) {
//     const { isActive, currentAngle, startAngle } = this.state;
//     if (isActive) {
//       const fromBoxCenter = this.getPositionFromCenter(e);
//       const newAngle =
//         90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
//       this.box.style.transform =
//         "rotate(" +
//         (currentAngle + (newAngle - (startAngle ? startAngle : 0))) +
//         "deg)";
//       this.setState({ angle: newAngle });
//     } // active conditional
//   }

//   render() {
//     return (
//       <div className="box-container">
//         <div
//           className="box"
//           onMouseDown={this.mouseDownHandler}
//           onMouseUp={this.mouseUpHandler}
//           ref={div => (this.box = div)}
//         >
//           Rotate
//         </div>
//       </div>
//     );
//   }
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
  const getPositionFromCenter = e => {
    const fromBoxCenter = {
      x: e.clientX - boxCenterPoint.x,
      y: -(e.clientY - boxCenterPoint.y)
    };
    return fromBoxCenter;
  }

  const mouseDownHandler = e => {
    e.stopPropagation();
    console.log('onMouseDown')
    const fromBoxCenter = getPositionFromCenter(e);
    const newStartAngle =
      90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
    setStartAngle(newStartAngle);
    setIsActive(true);
  }

  const mouseUpHandler = e => {
    deselectAll();
    e.stopPropagation();
    if (isActive) {
      const newCurrentAngle = currentAngle + (angle - startAngle);
      setIsActive(false);
      setCurrentAngle(newCurrentAngle);
    }
  }

  const mouseMoveHandler = e => {
    console.log(isActive)
    if (isActive) {
      console.log('is active move')
      const fromBoxCenter = getPositionFromCenter(e);
      const newAngle =
        90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
      box.style.transform =
        "rotate(" +
        (currentAngle + (newAngle - (startAngle ? startAngle : 0))) +
        "deg)";
      setAngle(newAngle)
    }
  }

  useEffect(() => {
    console.log('updating')
    if (box) {
      const boxPosition = box.getBoundingClientRect();
      // get the current center point
      const boxCenterX = boxPosition.left + boxPosition.width / 2;
      const boxCenterY = boxPosition.top + boxPosition.height / 2;

      // update the state
      setBoxCenterPoint({ x: boxCenterX, y: boxCenterY });
    }

    const mouseMoveHandler = e => {
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
    }

    // in case the event ends outside the box
    window.onmouseup = mouseUpHandler;
    window.onmousemove = mouseMoveHandler;
  }, [ box, isActive, currentAngle, startAngle ])

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
