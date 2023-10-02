import classNames from 'classnames';

// global gear
import MyButton_v2, { TmyBtn } from '../../button/myButton_v2';
// antd
import { Modal } from 'antd';

// css
import scss from './multButtonModal.module.scss';

export default function ThreeButtonModal({
  visible,
  text,
  onCancel,
  btnPropsArr = [],
  modalWidth = 400,
}: {
  visible: boolean;
  text: string;
  onCancel?: () => void;
  btnPropsArr?: TmyBtn[];
  modalWidth: number;
}) {
  return (
    <Modal
      className={scss.container}
      visible={visible}
      maskClosable={true}
      closable={false}
      centered={true}
      width={modalWidth}
      onCancel={onCancel}
      footer={<Footer btnPropsArr={btnPropsArr} />}
    >
      <p>{text}</p>
    </Modal>
  );
}

const Footer = ({ btnPropsArr, className }: { btnPropsArr: TmyBtn[]; className?: string }) => {
  return (
    <div className={classNames(scss.footer, className)}>
      {btnPropsArr.map((props, index) => {
        return <MyButton_v2 key={index} {...props} />;
      })}
    </div>
  );
};
