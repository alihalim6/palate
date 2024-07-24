import React, { useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

interface FinishRecordingProps {
  onDrag?: (dragPercent: number) => void;
  onStop?: () => void;
}

const FinishRecording = ({ onDrag, onStop }: FinishRecordingProps) => {
  const [deltaX, setDeltaX] = useState<number>(0);
  const draggableRef = useRef<HTMLDivElement>(null);

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    const parentWidth = draggableRef.current?.parentElement?.clientWidth;
    setDeltaX(deltaX + data.deltaX);

    if (parentWidth) {
      const draggableWidth = draggableRef.current.clientWidth;
      const dragPercent =
        (deltaX / (parentWidth / 2 - draggableWidth / 2)) * 100;
      onDrag?.(dragPercent);
    }
  };

  return (
    <Draggable
      nodeRef={draggableRef}
      axis="x"
      onDrag={handleDrag}
      onStop={onStop}
      bounds="parent"
    >
      <div
        ref={draggableRef}
        className="flex cursor-grab items-center justify-items-center gap-x-2 rounded-full bg-black p-5 active:cursor-grabbing"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-[0.33rem] w-[0.33rem] rounded-full bg-white"
          ></div>
        ))}
      </div>
    </Draggable>
  );
};

export default FinishRecording;
