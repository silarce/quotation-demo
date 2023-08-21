import { ReactNode } from 'react';
import classNames from 'classnames';

// antd
import { Modal } from 'antd';

// global gear
import TwoBtnFooter from 'components/global/gear/modal/footer/twoBtnFooter';
import InputSearch from 'components/global/gear/input/inputSearch';
import SearchBar, {
  TsearcbBarProps,
  TinputSelProps,
  TinputSelProp_search,
} from '../inputAndSel_v2/searchBar/searchBar';

// css
import scss from './selectorShell.module.scss';

// =====================================================
export type { TsearcbBarProps, TinputSelProp_search };

// =====================================================
export default function SelectorShell({
  children,
  label,
  visible,
  onConfirm,
  onCancel,
  className,
  width,
  tip,
  //
  searcbBarProps,
}: {
  children: ReactNode;
  label?: string;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
  placeholder?: string;
  width?: string;
  tip?: React.ReactNode;
  noSearch?: boolean;
  //
  searcbBarProps?: TsearcbBarProps;
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
          {searcbBarProps && <SearchBar {...searcbBarProps} />}
        </div>
        {/*  */}
        <div className={scss.body}>{children}</div>
        {/*  */}
        <TwoBtnFooter {...{ onConfirm, onCancel }} />
      </div>
    </Modal>
  );
}
