import React, { Component } from "react";

class App extends Component {
  constructor() {
    super();

    this.box = null;

    this.state = {
      isActive: false,
      angle: 0,
      startAngle: 0,
      currentAngle: 0,
      boxCenterPoint: {}
    };
    this.getPositionFromCenter = this.getPositionFromCenter.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
  }

  componentDidMount() {
    const boxPosition = this.box.getBoundingClientRect();
    // get the current center point
    const boxCenterX = boxPosition.left + boxPosition.width / 2;
    const boxCenterY = boxPosition.top + boxPosition.height / 2;

    // update the state
    this.setState({
      boxCenterPoint: { x: boxCenterX, y: boxCenterY }
    });
    // in case the event ends outside the box
    window.onmouseup = this.mouseUpHandler;
    window.onmousemove = this.mouseMoveHandler;
  }

  // to avoid unwanted behaviour, deselect all text
  deselectAll() {
    if (document.selection) {
      document.selection.empty();
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }

  // method to get the positionof the pointer event relative to the center of the box
  getPositionFromCenter(e) {
    const { boxCenterPoint } = this.state;
    const fromBoxCenter = {
      x: e.clientX - boxCenterPoint.x,
      y: -(e.clientY - boxCenterPoint.y)
    };
    return fromBoxCenter;
  }

  mouseDownHandler(e) {
    e.stopPropagation();
    const fromBoxCenter = this.getPositionFromCenter(e);
    const newStartAngle =
      90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
    this.setState({
      startAngle: newStartAngle,
      isActive: true
    });
  }

  mouseUpHandler(e) {
    this.deselectAll();
    e.stopPropagation();
    const { isActive, angle, startAngle, currentAngle } = this.state;
    if (isActive) {
      const newCurrentAngle = currentAngle + (angle - startAngle);
      this.setState({
        isActive: false,
        currentAngle: newCurrentAngle
      });
    }
  }

  mouseMoveHandler(e) {
    const { isActive, currentAngle, startAngle } = this.state;
    if (isActive) {
      const fromBoxCenter = this.getPositionFromCenter(e);
      const newAngle =
        90 - Math.atan2(fromBoxCenter.y, fromBoxCenter.x) * (180 / Math.PI);
      this.box.style.transform =
        "rotate(" +
        (currentAngle + (newAngle - (startAngle ? startAngle : 0))) +
        "deg)";
      this.setState({ angle: newAngle });
    } // active conditional
  }

  render() {
    return (
      <div className="box-container">
        <div
          className="box"
          onMouseDown={this.mouseDownHandler}
          onMouseUp={this.mouseUpHandler}
          ref={div => (this.box = div)}
        >
          Rotate
        </div>
      </div>
    );
  }
}

export default App;
