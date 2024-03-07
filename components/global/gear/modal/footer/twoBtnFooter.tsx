import classNames from 'classnames';

// components
// import MyButton from '../../button/myButton';
// import RedButton from '../../button/redButton';

// gear
import MyButton_v2 from '../../button/myButton_v2';

// css
import scss from './twoBtnFooter.module.scss';

export default function TwoBtnFooter({
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  className,
  isLoading,
}: {
  onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  confirmText?: string;
  cancelText?: string;
  className?: string;
  isLoading?: boolean;
}) {
  return (
    <div className={classNames(scss.container, className)}>
      {/* <RedButton label={confirmText || '確定'} onClick={onConfirm} />
      <MyButton label={cancelText || '取消'} onClick={onCancel} /> */}

      <MyButton_v2 label={confirmText || '確定'} onClick={onConfirm} theme="danger" isLoading={isLoading} />
      <MyButton_v2 label={cancelText || '取消'} onClick={onCancel} disabled={isLoading} />
    </div>
  );
}
