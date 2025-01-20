import { useRouter } from 'next/router';
import { TpanelList } from 'components/PageHeader/PageHeader02/PanelList';

import Dropdown from 'components/global/gear/dropdown/Dropdown';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// icon
import iconUpload from 'public/image/icon/upload.svg';
import iconRedLock from 'public/image/icon/redLock.svg';

import type { TquotationType } from 'pages/domestic/quotationList/quotation';

// ================================================================================
interface Tprops {
  disabled: boolean;
  quotationType: TquotationType;

  // isQuotation: boolean;
  // isAttachmentQuotation: boolean;
  // isNewQuotation: boolean;
  // isNewAttachmentQuotation: boolean;

  isReviewer: boolean | undefined | null;
  status: string;
  isDesignatedContent: boolean;
  //
  isAllReviewedBeforePending: boolean;
  //
  btnEditOnClick: () => void;
  btnCancelOnClick: () => void;

  btnPatchOnClick: () => void;
  btnModifyOnClick: () => void;
  btnPostOnClick: () => void;
  btnPatchModifyOnClick: () => void;

  cloneQuotation: () => void;
  cloneQuotation_relation: () => void;

  handleReqToPending: () => void;
  handleReview: () => void;
  handleSubmit: () => void;
  showVerifyForm: () => void;
  handleReqUnlock: () => void;
  //
  showPdf: () => void;
  showPdf_noDiscount: () => void;
  showPdf_part: () => void;
  //
  isQuotationExpired: boolean;
  quotationExpiredInfo: string;
}

// ================================================================================

// ================================================================================

const usePanel = ({
  disabled,
  quotationType,
  // isQuotation,
  // isAttachmentQuotation,
  // isNewQuotation,
  // isNewAttachmentQuotation,

  isReviewer,
  status,
  isDesignatedContent,

  btnEditOnClick,
  btnCancelOnClick,

  btnPatchOnClick,
  btnPostOnClick,
  btnModifyOnClick,
  btnPatchModifyOnClick,

  cloneQuotation,
  cloneQuotation_relation,
  showPdf,
  showPdf_noDiscount,
  showPdf_part,

  isAllReviewedBeforePending,

  handleReqToPending,

  handleReview,
  handleSubmit,
  showVerifyForm,
  handleReqUnlock,

  isQuotationExpired,
  quotationExpiredInfo,
}: Tprops) => {
  const router = useRouter();

  const isOldQuotation = quotationType === 'old' || quotationType === 'oldAttachment';

  const notAllowCopy =
    !disabled ||
    status === 'Pending' ||
    isDesignatedContent ||
    quotationType === 'new' ||
    quotationType === 'newAttachment' ||
    quotationType === 'oldAttachment' ||
    isQuotationExpired;

  // -----------------------------------------------------------------------

  const { label_update, btnUpdateOnClick } = (() => {
    let label_update = '更新報價單';

    let btnUpdateOnClick = btnPatchOnClick;

    if (quotationType === 'new') {
      btnUpdateOnClick = btnPostOnClick;
      label_update = '新建報價單';
    } else if (quotationType === 'newAttachment') {
      btnUpdateOnClick = btnModifyOnClick;
      label_update = '新建追加追減報價單';
    } else if (quotationType === 'oldAttachment') {
      btnUpdateOnClick = btnPatchModifyOnClick;
      label_update = '更新追加追減報價單';
    }

    return { label_update, btnUpdateOnClick };
  })();

  let label_cancel = '取消';
  let onClick_cancel = btnCancelOnClick;

  if (quotationType === 'new') {
    label_cancel = '返回';
    onClick_cancel = () => router.back();
  }

  const panel_update: TpanelList[number] = {
    type: 'redButton',
    label: label_update,
    onClick: btnUpdateOnClick,
  };
  const panel_cancel: TpanelList[number] = {
    type: 'myButton',
    label: label_cancel,
    onClick: onClick_cancel,
  };
  const panel_turnToPending: TpanelList[number] = {
    type: 'redButton',
    label: '轉為準合約',
    onClick: () => {
      myAlert.confirm({
        title: '確定轉為準合約',
        props: {
          onOk: handleReqToPending,
        },
      });
    },
  };
  const panel_review: TpanelList[number] = {
    type: 'myButton',
    label: '審核',
    onClick: handleReview,
  };
  const panel_submit: TpanelList[number] = {
    type: 'myButton',
    label: '送審',
    onClick: handleSubmit,
  };
  const panel_showVerifyForm: TpanelList[number] = {
    type: 'myButton',
    label: '合約審核表',
    onClick: showVerifyForm,
  };
  const panel_edit: TpanelList[number] = {
    type: 'myButton',
    label: '編輯',
    onClick: btnEditOnClick,
  };
  const panel_unlock: TpanelList[number] = {
    type: 'myButton',
    label: '解除鎖定並退回發包',
    img: iconRedLock.src,
    onClick: handleReqUnlock,
  };
  const panel_return: TpanelList[number] = {
    type: 'myButton',
    label: '返回',
    onClick: () => router.back(),
  };

  // -----------------------------------------------------------------------

  const customeRight: React.ReactNode[] = [
    notAllowCopy ? null : (
      <CloneQuotation
        key="CloneQuotation"
        cloneQuotation={cloneQuotation}
        cloneQuotation_relation={cloneQuotation_relation}
      />
    ),
    !disabled ? null : (
      <ExportQuotation
        key="ExportQuotation"
        showPdf={showPdf}
        setShowPdf_part={showPdf_part}
        showPdf_noDiscount={showPdf_noDiscount}
      />
    ),
  ];

  const panelList_abled: TpanelList = [
    //
    panel_update,
    panel_cancel,
  ];

  const panelList_disabled_quotation: TpanelList = [
    isOldQuotation && isAllReviewedBeforePending ? panel_turnToPending : null,
    isOldQuotation && isReviewer ? panel_review : null,
    isOldQuotation ? panel_submit : null,
    isOldQuotation && status === 'Pending' ? panel_showVerifyForm : null,
    status === 'Pending' ? null : panel_edit,
    status === 'Pending' || status === 'TempPending' ? panel_unlock : null,
    panel_return,
  ];

  const panelList_disabled_content: TpanelList = [panel_edit, panel_return];

  const panelList_disabled: TpanelList = isDesignatedContent
    ? panelList_disabled_content
    : panelList_disabled_quotation;

  const panelList_expired: TpanelList = [
    {
      type: 'redButton',
      label: '報價單過期',
      onClick: () => {
        myAlert.info({ title: '報價單過期', content: quotationExpiredInfo });
      },
    },
    panel_return,
  ];

  // const panelList = disabled ? panelList_disabled : panelList_abled;
  const panelList = isQuotationExpired ? panelList_expired : disabled ? panelList_disabled : panelList_abled;

  return { panelList, customeRight };
};

// ================================================================================

const ExportQuotation = ({
  showPdf,
  setShowPdf_part,
  showPdf_noDiscount,
}: {
  showPdf: () => void;
  setShowPdf_part: () => void;
  showPdf_noDiscount: () => void;
}) => {
  return (
    <Dropdown
      key="1"
      // placement="bottomRight"
      itemArr={[
        //
        <MyButton_v2 key="1" img={iconUpload.src} onClick={showPdf}>
          匯出報價單
        </MyButton_v2>,
        <MyButton_v2 key="2" img={iconUpload.src} onClick={setShowPdf_part}>
          單價分析
        </MyButton_v2>,
        <MyButton_v2 key="3" img={iconUpload.src} onClick={showPdf_noDiscount}>
          {'匯出報價單(無折扣)'}
        </MyButton_v2>,
      ]}
    >
      匯出
    </Dropdown>
  );
};

const CloneQuotation = ({
  cloneQuotation,
  cloneQuotation_relation,
}: {
  cloneQuotation: () => void;
  cloneQuotation_relation: () => void;
}) => {
  return (
    <Dropdown
      key="0"
      itemArr={[
        //
        <MyButton_v2 key="1" onClick={cloneQuotation}>
          一般複製
        </MyButton_v2>,
        <MyButton_v2 key="2" onClick={cloneQuotation_relation}>
          關聯報價
        </MyButton_v2>,
      ]}
    >
      複製報價單
    </Dropdown>
  );
};

// ================================================================================
export { usePanel };
