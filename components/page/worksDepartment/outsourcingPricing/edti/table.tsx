import classNames from 'classnames';

import Table01, { Ttable } from 'components/global/gear/table/table01';

// icon
import { IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

import scss from './table.module.scss';

export default function Table({
  caption,
  control,
  className,
  onAddClick,
  disabled,
}: {
  caption: string;
  control: Ttable;
  className?: string;
  onAddClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={classNames(className)}>
      <div className={scss.captionBar}>
        <p className={scss.tableCaption}>{caption}</p>
        <IconAddCircle onClick={onAddClick} className={classNames((!onAddClick || disabled) && 'invisible')} />
      </div>
      <Table01 {...control} />
    </div>
  );
}
