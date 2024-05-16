import classNames from 'classnames';

// antd
import { Modal, ModalFuncProps } from 'antd';
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

const myAlert = {
  info: ModalInfo02,
  success: ModalSuccess,
  err: ModalErr,
  warning: ModalWarning,
  confirm: ModalConfirm,
  loading: ModalLoading,
  destroyAll: Modal.destroyAll,
  btnBar: ModalBtnBar,
};

export default myAlert;

export type { TbtnPropsArr };

// ====================================================
// ====================================================
