// components
import MyButton from '../../button/myButton';
import RedButton from '../../button/redButton';

// css
import style from './twoBtnFooter.module.scss';

export default function TwoBtnFooter({
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}: {
  onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  confirmText?: string;
  cancelText?: string;
}) {
  return (
    <div className={style.container}>
      <RedButton label={confirmText || '確定'} onClick={onConfirm} />
      <MyButton label={cancelText || '取消'} onClick={onCancel} />
    </div>
  );
}
