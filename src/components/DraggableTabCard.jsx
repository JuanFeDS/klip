import { useDrag } from 'react-dnd';
import { ItemTypes } from '../utils/dragTypes';
import TabCard from './TabCard';

const DraggableTabCard = ({ id, ...props }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.KLIP,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      className="relative"
    >
      <TabCard {...props} />
    </div>
  );
};

export default DraggableTabCard;
