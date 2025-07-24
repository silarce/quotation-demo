import classNames from 'classnames';

import Btn, { Tprops_btn } from '../../button/btn_fong';

import { Modal, ModalFuncProps } from 'antd';
import { Container_confirm } from 'components/global/container/modal';

import Icon_warning from 'public/image/icon/fong/warning.svg';

import scss from './index.module.scss';
import React from 'react';

// ============================================================================

// ============================================================================

const modal_clean = ({ className, ...props }: ModalFuncProps) => {
  return Modal.info({
    className: classNames(scss.clean, className),
    icon: null,
    maskClosable: true,
    centered: true,
    footer: null,
    width: 'fit-content',
    ...props,
  });
};

const modal_empty = ({ className, ...props }: ModalFuncProps) => {
  return Modal.info({
    className: classNames(scss.empty, className),
    icon: null,
    maskClosable: true,
    centered: true,
    footer: null,
    width: 'fit-content',
    ...props,
  });
};

const modal_confirm = ({
  title,
  content: theContent,
  content_footer,
  props_footer,
  ...props
}: ModalFuncProps & {
  content_footer?: React.ReactNode;
  props_footer?: React.HTMLAttributes<HTMLDivElement>;
} = {}) => {
  const content = (
    <Container_confirm title={title} props_footer={props_footer} footerRight={content_footer}>
      {theContent}
    </Container_confirm>
  );

  return modal_empty({ content, ...props });
};

// ==========================================================================

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
  title = "確認刪除嗎？'",
  content = '此操作將永久刪除，且無法復原。',
  onCancel,
  onConfirm,
  closeOnCancel = true,
  closeOnConfirm = true,
  cancelText = '取消',
  confirmText = '確認刪除',
}: {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  closeOnCancel?: boolean;
  closeOnConfirm?: boolean;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
} = {}) => {
  const instance = modal_clean({
    content: (
      <Template_confirm
        icon={<Icon_warning className="text-red01" />}
        title={title}
        content={content}
        panel={
          <>
            <Btn
              onClick={() => {
                onCancel?.();
                closeOnCancel && instance.destroy();
              }}
            >
              {cancelText}
            </Btn>
            <Btn
              onClick={() => {
                onConfirm?.();
                closeOnConfirm && instance.destroy();
              }}
              theme="trash"
            >
              {confirmText}
            </Btn>
          </>
        }
      />
    ),
  });

  return instance;
};

const modal_leave = ({
  title = '確認離開嗎？',
  content = '尚有資料未儲存,確定離開嗎。',
  onCancel,
  onConfirm,
  closeOnCancel = true,
  closeOnConfirm = true,
  cancelText = '取消',
  confirmText = '確認離開',
}: {
  title?: React.ReactNode;
  content?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  closeOnCancel?: boolean;
  closeOnConfirm?: boolean;
  cancelText?: React.ReactNode;
  confirmText?: React.ReactNode;
} = {}) => {
  const instance = modal_clean({
    content: (
      <Template_confirm
        icon={<Icon_warning className="text-yellow01" />}
        title={title}
        content={content}
        panel={
          <>
            <Btn
              onClick={() => {
                onCancel?.();
                closeOnCancel && instance.destroy();
              }}
            >
              {cancelText}
            </Btn>
            <Btn
              theme="warning_2"
              onClick={() => {
                onConfirm?.();
                closeOnConfirm && instance.destroy();
              }}
            >
              {confirmText}
            </Btn>
          </>
        }
      />
    ),
  });

  return instance;
};

export { modal_clean, modal_empty, modal_confirm, modal_delete, modal_leave };
