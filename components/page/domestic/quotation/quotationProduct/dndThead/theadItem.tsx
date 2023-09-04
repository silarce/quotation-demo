import classNames from 'classnames';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// css
// import style from './theadItem.module.scss';
import styleL from '../../local.module.scss';

interface TtheadItem {
  id: string;
  label: string;
  width: string;
}

export default function TheadItem({
  theadInfo,
  allowMove,
  isMoving,
  className,
}: {
  theadInfo: TtheadItem;
  allowMove?: boolean;
  isMoving?: boolean;
  className?: string;
}) {
  const { id, label, width } = theadInfo;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    disabled: allowMove ? false : true,
    // transition: {
    //   duration: 200,
    //   easing: "ease"
    // }
  });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    width,
  };

  // ===========================================================

  const styleAllowMove = allowMove ? styleL.allowMove : '';
  const styleIsMoving = isMoving ? styleL.isMoving : '';

  return (
    <div
      className={classNames(styleL.theadCell, styleAllowMove, styleIsMoving, className, 'relative')}
      ref={setNodeRef}
      style={itemStyle}
      {...attributes}
      {...listeners}
    >
      <span>{label}</span>
    </div>
  );
}
// ==========================================================
