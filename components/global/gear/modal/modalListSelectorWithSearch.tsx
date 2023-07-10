import { ReactNode } from 'react';
import classNames from 'classnames';

// antd
import { Modal } from 'antd';

// global gear
import TwoBtnFooter from 'components/global/gear/modal/footer/twoBtnFooter';
import InputSearch from 'components/global/gear/input/inputSearch';

// css
import scss from './modalListSelectorWithSearch.module.scss';

// =====================================================
export default function ModalListSelectorWithSearch({
  children,
  label,
  visible,
  onConfirm,
  onCancel,
  onSearch,
  className,
  placeholder,
  width,
  tip,
  noSearch,
}: {
  children: ReactNode;
  label: string;
  visible: boolean;
  // onClick會寫在children裡面
  onConfirm: () => void;
  onCancel: () => void;
  onSearch: (value: string) => void;
  className?: string;
  placeholder?: string;
  width?: string;
  tip?: React.ReactNode;
  noSearch?: boolean;
}) {
  // ======================================================

  return (
    <Modal
      className={classNames(scss.modal, className)}
      visible={visible}
      closable={false}
      centered={true}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={null}
      width={width}
    >
      <div className={scss.container}>
        <div className={scss.header}>
          <div className={scss.left}>
            <div className={scss.filler} />
            <div className={scss.label}>{label}</div>
            <div className={scss.tip}>{tip}</div>
          </div>
          {!noSearch && (
            <InputSearch
              className={classNames(scss.right, scss.plus)}
              placeholder={placeholder || '輸入關鍵字'}
              onClick={onSearch}
            />
          )}
        </div>
        {/*  */}
        <div className={scss.body}>{children}</div>
        {/*  */}
        <TwoBtnFooter {...{ onConfirm, onCancel }} />
      </div>
    </Modal>
  );
}
