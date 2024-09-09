import classNames from 'classnames';
import scss from './tablePanel.module.scss';

// icon
import { IconCheck02, IconEdit, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

const TablePanel_basic = ({
  //
  disabled,
  setDisabled,
  onConfirm,
  onDelete,
}: {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <div className={scss.panel}>
      <IconCheck02 className={classNames(scss.check, disabled && scss.invisible)} onClick={onConfirm} />
      <IconEdit
        className={classNames(scss.edit, scss.plus, !disabled && scss.active)}
        onClick={() => setDisabled((state) => !state)}
      />
      <IconDelete01 className={classNames()} onClick={onDelete} />
    </div>
  );
};

export { TablePanel_basic };
