import classNames from 'classnames';
import InputSel, { TinputSelProps } from '../../inputAndSel_v2/inputSel';

// antd
import { Modal, ModalFuncProps, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// gear
import MyButton_v2, { TmyBtn } from '../../button/myButton_v2';

// css
import style from './alertModals.module.scss';

// ==================================================

type TbtnPropsArr = TmyBtn[];

// ==================================================

const modalProps = {
  className: style.alert,
  okText: '確認',
  maskClosable: true,
  centered: true,
};

export const ModalInfo = (title?: string | number, content?: string | number, props?: ModalFuncProps) => {
  return Modal.info({
    title,
    content,
    ...modalProps,
    ...props,
  });
};

export const ModalInfo02 = ({
  title,
  content,
  props,
  className,
}: {
  title?: string | number;
  content?: string | number;
  props?: ModalFuncProps;
  className?: string;
}) => {
  const theClassName = classNames(modalProps.className, className);

  return Modal.info({
    title,
    content,
    ...modalProps,
    className: theClassName,
    ...props,
  });
};

// ==================================================
export const ModalSuccess = ({
  title,
  content,
  props,
  className,
}: {
  title?: string | number;
  content?: string | number;
  props?: ModalFuncProps;
  className?: string;
}) => {
  const theClassName = classNames(modalProps.className, className);

  return Modal.success({
    title,
    content,
    ...modalProps,
    className: theClassName,
    ...props,
  });
};

// ==================================================
export const ModalErr = ({
  title,
  content,
  props,
  className,
}: {
  title?: string | number;
  content?: string | number;
  props?: ModalFuncProps;
  className?: string;
}) => {
  const theClassName = classNames(modalProps.className, className);

  return Modal.error({
    title,
    content,
    ...modalProps,
    className: theClassName,
    ...props,
  });
};
// ====================================================

export const ModalWarning = ({
  title,
  content,
  props,
  className,
}: {
  title?: string | number;
  content?: string | number;
  props?: ModalFuncProps;
  className?: string;
}) => {
  const theClassName = classNames(modalProps.className, className);

  return Modal.warning({
    title,
    content,
    ...modalProps,
    className: theClassName,
    ...props,
  });
};

// ====================================================

export const ModalConfirm = ({
  title,
  content,
  props,
  className,
}: {
  title?: string | number;
  content?: string | number | React.ReactNode;
  props?: ModalFuncProps;
  className?: string;
}) => {
  const { className: className01 } = modalProps;
  const theClassName = classNames(className01, style.confirm, className);

  return Modal.confirm({
    icon: <></>,
    ...modalProps,
    title,
    content,
    cancelText: '取消',
    ...props,
    className: classNames(theClassName, props?.className),
  });
};

// ====================================================
export const ModalLoading = (
  theProps: {
    title?: string | number;
    content?: string | number;
    showBtn?: boolean;
    props?: ModalFuncProps;
  } = {}
) => {
  const { title, content, showBtn, props } = theProps!;
  const styleShowBtn = showBtn ? style.showBtn : '';
  const theClassName = classNames(style.loading, styleShowBtn);

  return Modal.info({
    className: theClassName,
    title,
    content,
    icon: <LoadingOutlined />,
    centered: true,
    keyboard: false,
    zIndex: 9999,
    ...props,
  });
};
// ====================================================

export const ModalBtnBar = ({
  title,
  content,
  props,
  className,
  btnPropsArr,
  width = 'auto',
}: {
  title?: string | number;
  content?: React.ReactNode;
  props?: ModalFuncProps;
  className?: string;
  btnPropsArr?: TbtnPropsArr;
  width?: React.CSSProperties['width'];
}) => {
  // const { className: className01 } = modalProps;
  // const theClassName = classNames(className01, style.confirm, className);
  content = (
    <>
      {content}
      {btnPropsArr && <BtnBar btnPropsArr={btnPropsArr} />}
    </>
  );

  return Modal.confirm({
    icon: <></>,
    ...modalProps,
    title,
    content,
    // cancelText: '取消',
    // footer: null,

    cancelButtonProps: {
      style: { display: 'none' },
    },
    okButtonProps: {
      style: { display: 'none' },
    },
    width,
    ...props,
    className: classNames(style.confirm, modalProps.className, props?.className, className),
  });
};

// ====================================================

const ModalClear = (props?: ModalFuncProps) => {
  return Modal.info({
    width: 'fit-content',
    icon: <></>,
    maskClosable: true,
    centered: true,
    cancelButtonProps: {
      style: { display: 'none' },
    },
    okButtonProps: {
      style: { display: 'none' },
    },
    // bodyStyle: {
    //   padding: 'unset',
    // },
    ...props,
    className: classNames(
      //
      style.clear,
      props?.className
      // modalProps.className
    ),
  });
};

// ====================================================

const ModalInut = (props: {
  title?: string | number;
  props?: ModalFuncProps;
  className?: string;
  width?: React.CSSProperties['width'];
  onConfirm?: (value: string) => void;
  isTextArea?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) => {
  const { onConfirm, isTextArea, defaultValue, placeholder, width = 'auto', ...rest } = props;

  const modal = Modal.confirm({
    icon: <></>,
    ...modalProps,

    cancelButtonProps: {
      style: { display: 'none' },
    },
    okButtonProps: {
      style: { display: 'none' },
    },
    width,
    ...rest,
    className: classNames(style.confirm, modalProps.className, props?.className),
  });

  modal.update({
    content: (
      <Input
        className={'mt-10'}
        isTextArea={isTextArea}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onConfirm={onConfirm}
        onCancel={modal.destroy}
      />
    ),
  });

  return modal;
};

// ====================================================

const BtnBar = ({ btnPropsArr }: { btnPropsArr: TbtnPropsArr }) => {
  return (
    <div className={style.btnBar}>
      {btnPropsArr.map((props, index) => {
        return <MyButton_v2 key={index} {...props} />;
      })}
    </div>
  );
};

// ====================================================

const Input = ({
  isTextArea,
  placeholder,
  defaultValue,
  onConfirm,
  onCancel,
  className,
}: {
  isTextArea?: boolean;
  placeholder?: string;
  defaultValue?: string;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  className?: string;
}) => {
  const inputSelProps: TinputSelProps = (() => {
    if (isTextArea) {
      return {
        showBaseline: 'invisible',
        textareaProps: {
          allowNewLineByUser: true,
          props: {
            defaultValue,
            placeholder,
            name: 'input',
            minRows: 5,
            maxRows: 5,
            className: 'border border-border',
          },
        },
      };
    } else {
      return {
        inputProps: {
          props: {
            defaultValue,
            placeholder,
            name: 'input',
          },
        },
      };
    }
  })();

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const value = e.currentTarget['input'].value;
        onConfirm?.(value);
      }}
    >
      <InputSel {...inputSelProps} />
      <div className="flex gap-8 mt-10 justify-center">
        <MyButton_v2
          theme="danger"
          buttonProps={{
            htmlType: 'submit',
          }}
        >
          確認
        </MyButton_v2>
        <MyButton_v2 onClick={onCancel}>取消</MyButton_v2>
      </div>
    </form>
  );
};

// ====================================================

const myAlert = {
  info: ModalInfo02,
  success: ModalSuccess,
  err: ModalErr,
  warning: ModalWarning,
  confirm: ModalConfirm,
  loading: ModalLoading,
  destroyAll: Modal.destroyAll,
  btnBar: ModalBtnBar,
  clear: ModalClear,
  input: ModalInut,
  notify: {
    open: notification.open,
    close: notification.close,
    destroy: notification.destroy,

    success: notification.success,
    error: notification.error,
    info: notification.info,
    warning: notification.warning,
    warn: notification.warn,
  },
};

export default myAlert;

export type { TbtnPropsArr };

// ====================================================
// ====================================================
