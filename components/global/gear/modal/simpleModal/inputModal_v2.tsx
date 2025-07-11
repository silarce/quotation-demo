import classNames from 'classnames';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// antd
import { Modal } from 'antd';

//global gear
import TwoBtnFooter from 'components/global/gear/modal/footer/twoBtnFooter';

// css
import scss from './simpleModal.module.scss';

// =====================================================
type TinputModalProps = {
  open: boolean;
  title: string;
  className?: string;
  tip?: string;
  placeholder?: string;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
};

export type { TinputModalProps };

// =====================================================
export default function InputModal({
  open: visible,
  title,
  className,
  tip,
  placeholder,
  onConfirm,
  onCancel,
  inputAttr,
}: TinputModalProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (visible === false) {
      setValue('');
    }
  }, [visible]);

  const theOnConfirm = () => {
    onConfirm?.(value);
  };

  const theOnCancel = () => {
    onCancel?.();
  };

  return (
    <Modal
      className={classNames(scss.inputModal, className)}
      open={visible}
      closable={false}
      centered={true}
      width={405}
      onCancel={onCancel}
      destroyOnHidden={true}
      footer={<TwoBtnFooter onConfirm={theOnConfirm} onCancel={theOnCancel} />}
    >
      <p className={scss.title}>{title}</p>
      {tip && <p className={scss.tip}>{tip}</p>}

      <div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...inputAttr}
        />
      </div>
    </Modal>
  );
}

// ============================================
