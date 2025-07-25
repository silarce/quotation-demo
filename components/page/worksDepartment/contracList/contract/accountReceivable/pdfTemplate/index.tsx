// import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import Modal, { ModalProps } from 'components/global/myAntd/modal';

export default function PdfTemplate_accountReceivable({ open }: ModalProps) {
  return (
    <Modal open={open}>
      <Template />
    </Modal>
  );
}

const Template = () => {
  return (
    <div>
      <h1>應收帳款明細</h1>
      <div></div>
    </div>
  );
};
