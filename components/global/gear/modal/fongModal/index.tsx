import classNames from 'classnames';

import Btn, { Tprops_btn } from '../../button/btn_fong';

import { Modal, ModalFuncProps } from 'antd';

import Icon_warning from 'public/image/icon/fong/warning.svg';

import scss from './index.module.scss';

const Modal_clean = ({ className, ...props }: ModalFuncProps) => {
  return Modal.info({
    className: classNames(scss.clean, className),
    width: 'unset',
    icon: null,
    maskClosable: true,
    centered: true,
    footer: null,
    ...props,
  });
};

const Template_confirm = ({
  icon,
  title,
  content,
  panel,
}: {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  content?: React.ReactNode;
  panel?: React.ReactNode;
}) => {
  return (
    <div className={scss.template_confirm}>
      <div className={scss.header}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className={scss.content}>{content}</div>
      <div className={scss.panel}>{panel}</div>
    </div>
  );
};

const modal_delete = ({
  onCancel,
  onConfirm,
  closeOnCancel = true,
  closeOnConfirm = true,
}: {
  onCancel?: () => void;
  onConfirm?: () => void;
  closeOnCancel?: boolean;
  closeOnConfirm?: boolean;
} = {}) => {
  const instance = Modal_clean({
    content: (
      <Template_confirm
        icon={<Icon_warning className="text-red01" />}
        title="確認刪除嗎？'"
        content="此操作將永久刪除，且無法復原。"
        panel={
          <>
            <Btn
              onClick={() => {
                onCancel?.();
                closeOnCancel && instance.destroy();
              }}
            >
              取消
            </Btn>
            <Btn
              onClick={() => {
                onConfirm?.();
                closeOnConfirm && instance.destroy();
              }}
              theme="trash"
            >
              確認刪除
            </Btn>
          </>
        }
      />
    ),
  });

  return instance;
};

const modal_leave = ({
  onCancel,
  onConfirm,
  closeOnCancel = true,
  closeOnConfirm = true,
}: {
  onCancel?: () => void;
  onConfirm?: () => void;
  closeOnCancel?: boolean;
  closeOnConfirm?: boolean;
} = {}) => {
  const instance = Modal_clean({
    content: (
      <Template_confirm
        icon={<Icon_warning className="text-yellow01" />}
        title="確認離開嗎？"
        content="尚有資料未儲存,確定離開嗎。"
        panel={
          <>
            <Btn
              onClick={() => {
                onCancel?.();
                closeOnCancel && instance.destroy();
              }}
            >
              取消
            </Btn>
            <Btn
              theme="warning_2"
              onClick={() => {
                onConfirm?.();
                closeOnConfirm && instance.destroy();
              }}
            >
              確認離開
            </Btn>
          </>
        }
      />
    ),
  });

  return instance;
};

export { Modal_clean, modal_delete, modal_leave };
