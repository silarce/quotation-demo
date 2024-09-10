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
  showEdit = true,
  showDelete = true,
  showConfirm = true,
}: {
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => void;
  onDelete?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showConfirm?: boolean;
}) => {
  return (
    <div className={scss.panel}>
      <IconCheck02
        className={classNames(scss.check, disabled && scss.invisible, !showConfirm && scss.invisible)}
        onClick={onConfirm}
      />
      <IconEdit
        className={classNames(scss.edit, scss.plus, !disabled && scss.active, !showEdit && scss.invisible)}
        onClick={() => setDisabled((state) => !state)}
      />
      {onDelete && <IconDelete01 className={classNames(!showDelete && scss.invisible)} onClick={onDelete} />}
    </div>
  );
};

export { TablePanel_basic };
