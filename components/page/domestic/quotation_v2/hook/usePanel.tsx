import { useRouter } from 'next/router';
import { TpanelList } from 'components/PageHeader/PageHeader02/PanelList';

import Dropdown from 'components/global/gear/dropdown/Dropdown';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// icon
import iconUpload from 'public/image/icon/upload.svg';
import iconRedLock from 'public/image/icon/redLock.svg';

// ================================================================================
interface Tprops {
  disabled: boolean;
  isNewQuotation: boolean;
  isQuotation: boolean;
  isReviewer: boolean | undefined | null;
  status: string;
  isDesignatedContent: boolean;
  //
  isAllReviewedBeforePending: boolean;
  //
  btnEditOnClick: () => void;
  btnCancelOnClick: () => void;
  btnPatchOnClick: () => void;
  btnPostOnClick: () => void;
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
}

// ================================================================================

// ================================================================================

const usePanel = ({
  disabled,
  isNewQuotation,
  isQuotation,
  isReviewer,
  status,
  isDesignatedContent,

  btnEditOnClick,
  btnCancelOnClick,
  btnPatchOnClick,
  btnPostOnClick,
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
}: Tprops) => {
  const router = useRouter();

  // -----------------------------------------------------------------------

  const panel_update: TpanelList[number] = {
    type: 'redButton',
    label: isNewQuotation ? '新建報價單' : '更新報價單',
    onClick: isNewQuotation ? btnPostOnClick : btnPatchOnClick,
  };
  const panel_cacel: TpanelList[number] = {
    type: 'myButton',
    label: isNewQuotation ? '返回' : '取消',
    onClick: isNewQuotation ? () => router.back() : btnCancelOnClick,
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
    !disabled || status === 'Pending' || isDesignatedContent ? null : (
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
    panel_cacel,
  ];

  const panelList_disabled_quotation: TpanelList = [
    isQuotation && isAllReviewedBeforePending ? panel_turnToPending : null,
    isQuotation && isReviewer ? panel_review : null,
    isQuotation ? panel_submit : null,
    !isNewQuotation && status === 'Pending' ? panel_showVerifyForm : null,
    status === 'Pending' ? null : panel_edit,
    status === 'Pending' || status === 'TempPending' ? panel_unlock : null,
    panel_return,
  ];

  const panelList_disabled_content: TpanelList = [panel_edit, panel_return];

  const panelList_disabled: TpanelList = isDesignatedContent
    ? panelList_disabled_content
    : panelList_disabled_quotation;

  const panelList = disabled ? panelList_disabled : panelList_abled;

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
