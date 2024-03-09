import { useState } from 'react';
import interact from 'interactjs'

const position = { x: 0, y: 0 }

interact('.draggable').draggable({
  listeners: {
    start (event) {
      console.log(event.type, event.target)
    },
    move (event) {
      position.x += event.dx
      position.y += event.dy

      event.target.style.transform =
        `translate(${position.x}px, ${position.y}px)`
    },
  }
})




export default function ApplicationTracker() {
  const [count, setCount] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    setIsMoving(true);
  };

  const handleMouseUp = (event) => {
    setIsMoving(false);
  };

  const handleMouseMove = (event) => {
    if (isMoving) {
      setBoxPosition({
        x: event.clientX + window.scrollX,
        y: event.clientY + window.scrollY,
      });
    }
  };

  const handleStyle = () => {
    return {
      // top: boxPosition.y,
      // left: boxPosition.x,
      bottom: '10vh',
      right: '10vw',
      backgroundColor: 'red',
      minHeight: '400px',
      maxHeight: '400px',
      maxWidth: '300px',
      minWidth: '300px',
    };
  };
  return (
    <div className='ApplicationTracker'>
      <p>
        {/* {boxPosition.x} {boxPosition.y} */}
      </p>
      <div
        className="card draggable resizable"
        style={{
          position: 'fixed',
          ...handleStyle(),
        }}
        // onMouseDown={handleMouseDown}
        // onMouseUp={handleMouseUp}
        // onMouseMove={handleMouseMove}
      >
        <p>Application Tracker</p>
        <button className='btn' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

