import Router from 'next/router';
import { TpanelList } from 'components/PageHeader/PageHeader02/PanelList';

import Dropdown from 'components/global/gear/dropdown/Dropdown';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// icon
import iconUpload from 'public/image/icon/upload.svg?url';
import iconRedLock from 'public/image/icon/redLock.svg?url';

import type { TquotationType } from 'pages/domestic/quotationList/quotation_refactored';

// ================================================================================

type TpanelItem = TpanelList[number];

interface Tprops {
  disabled: boolean;
  quotationType: TquotationType;
  isReviewer: boolean | undefined | null;
  status: string;
  isDesignatedContent: boolean;
  isAllReviewedBeforePending: boolean;
  isQuotationExpired: boolean;
  quotationExpiredInfo: React.ReactNode;
  //
  setDisabled: (disabled: boolean) => void;
  handlePatch: () => void;
  handlePost: () => void;
  handleModify: () => void;
  handlePatchModify: () => void;

  handleClone: (isRelationQuotation?: boolean | undefined) => Promise<void>;

  handleReqToPending: () => void;
  handleReview: () => void;
  preHandleSubmit: () => void;
  showVerifyForm: () => void;

  handleReqUnlock: () => void;
  showPdf: () => void;
  showPdf_noDiscount: () => void;
  showPdf_part: () => void;

  restoreAllState: undefined | null | (() => void);
  clearBackup: undefined | null | (() => void);
  doExportBackup: () => void;
  doImportBackup: () => void;
}

// ================================================================================

const usePanel = ({
  disabled,
  quotationType,
  isReviewer,
  status,
  isDesignatedContent,
  isAllReviewedBeforePending,
  isQuotationExpired,
  quotationExpiredInfo,
  //
  setDisabled,
  handlePatch,
  handlePost,
  handleModify,
  handlePatchModify,

  handleClone,

  handleReqToPending,
  handleReview,
  preHandleSubmit,
  showVerifyForm,

  handleReqUnlock,
  showPdf,
  showPdf_noDiscount,
  showPdf_part,

  restoreAllState,
  clearBackup,
  doExportBackup,
  doImportBackup,
}: Tprops) => {
  const isOldQuotation = quotationType === 'old' || quotationType === 'oldAttachment';

  const notAllowCopy =
    !disabled ||
    status === 'Pending' ||
    isDesignatedContent ||
    quotationType === 'new' ||
    quotationType === 'newAttachment' ||
    quotationType === 'oldAttachment' ||
    isQuotationExpired;

  //

  const panel_patch: TpanelItem = {
    type: 'redButton',
    label: '更新報價單',
    onClick: handlePatch,
  };

  const panel_post: TpanelItem = {
    type: 'redButton',
    label: '新建報價單',
    onClick: handlePost,
  };

  const panel_modify: TpanelItem = {
    type: 'redButton',
    label: '新建追加追減報價單',
    onClick: handleModify,
  };

  const panel_patchModify: TpanelItem = {
    type: 'redButton',
    label: '更新追加追減報價單',
    onClick: handlePatchModify,
  };

  const panel_cancelEdit: TpanelItem = {
    type: 'myButton',
    label: '取消',
    onClick: () => {
      myAlert.confirm({
        title: '確定要取消編輯?',
        content: '所有未儲存的變更將會被捨棄',
        props: {
          onOk: () => {
            setDisabled(true);
            clearBackup && clearBackup();
          },
        },
      });
    },
  };

  const panel_edit: TpanelItem = {
    type: 'myButton',
    label: '編輯',
    onClick: () => {
      setDisabled(false);
    },
  };

  const panel_return: TpanelItem = {
    type: 'myButton',
    label: '返回',
    onClick: () => {
      Router.back();
    },
  };

  const panel_returnAndClearBackup: TpanelItem = {
    type: 'myButton',
    label: '返回',
    onClick: () => {
      let content = '所有未儲存的變更將會被捨棄';
      clearBackup && (content = content + '，備份資料也將被清除');

      myAlert.confirm({
        title: '確定要返回?',
        content: content,
        props: {
          onOk: () => {
            clearBackup && clearBackup();
            Router.back();
          },
        },
      });
    },
  };

  const panel_turnToPending: TpanelItem = {
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
  const panel_review: TpanelItem = {
    type: 'myButton',
    label: '審核',
    onClick: handleReview,
  };
  const panel_submit: TpanelItem = {
    type: 'myButton',
    label: '送審',
    onClick: preHandleSubmit,
  };
  const panel_showVerifyForm: TpanelItem = {
    type: 'myButton',
    label: '合約審核表',
    onClick: showVerifyForm,
  };

  const panel_unlock: TpanelItem = {
    type: 'myButton',
    label: '解除鎖定並退回發包',
    img: iconRedLock.src,
    onClick: handleReqUnlock,
  };

  const panel_restore: TpanelItem = {
    type: 'myButton',
    label: '回復備份狀態',
    onClick: () => {
      restoreAllState && restoreAllState();
    },
  };

  const panel_exportBackup: TpanelItem = {
    type: 'myButton',
    label: '匯出備份資料',
    onClick: () => {
      doExportBackup();
    },
  };

  const panel_importBackup: TpanelItem = {
    type: 'myButton',
    label: '匯入備份資料',
    onClick: () => {
      doImportBackup();
    },
  };

  const panel_expired: TpanelItem = {
    type: 'redButton',
    label: '報價單過期',
    onClick: () => {
      myAlert.info({ title: '報價單過期', content: quotationExpiredInfo });
    },
  };

  //
  //

  const customeRight: React.ReactNode[] = [
    notAllowCopy ? null : (
      <CloneQuotation
        key="CloneQuotation"
        cloneQuotation={() => {
          handleClone();
        }}
        cloneQuotation_relation={() => {
          handleClone(true);
        }}
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

  //
  //

  const panelList_edited: TpanelList = [panel_edit];

  const panelList_abled: TpanelList = [
    ...{
      new: [
        // panel_post,
        panel_exportBackup,
        panel_importBackup,
        restoreAllState ? panel_restore : null,
        panel_returnAndClearBackup,
      ],
      old: [
        panel_patch,
        panel_exportBackup,
        panel_importBackup,
        restoreAllState ? panel_restore : null,
        panel_cancelEdit,
      ],
      newAttachment: [panel_modify, restoreAllState ? panel_restore : null, panel_cancelEdit],
      oldAttachment: [panel_patchModify, restoreAllState ? panel_restore : null, panel_cancelEdit],
      undefined: [],
    }[quotationType || 'undefined'],
  ];

  const panelList_disabled_quotation: TpanelList = [
    isOldQuotation && isAllReviewedBeforePending ? panel_turnToPending : null,
    isOldQuotation && isReviewer ? panel_review : null,
    isOldQuotation ? panel_submit : null,
    isOldQuotation && status === 'Pending' ? panel_showVerifyForm : null,
    ...(status === 'Pending' ? [] : panelList_edited),
    status === 'Pending' || status === 'TempPending' ? panel_unlock : null,
    panel_return,
  ];

  const panelList_disabled_content: TpanelList = [...panelList_edited, panel_return];

  const panelList_disabled: TpanelList = isDesignatedContent
    ? panelList_disabled_content
    : panelList_disabled_quotation;

  const panelList_expired: TpanelList = [panel_expired, panel_return];

  //
  const panelList = isQuotationExpired ? panelList_expired : disabled ? panelList_disabled : panelList_abled;
  //

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
      menu={{
        items: [
          {
            key: '0',
            label: (
              <MyButton_v2 img={iconUpload.src} onClick={showPdf} className={'!w-full'}>
                匯出報價單
              </MyButton_v2>
            ),
          },
          {
            key: '1',
            label: (
              <MyButton_v2 img={iconUpload.src} onClick={setShowPdf_part} className={'!w-full'}>
                單價分析
              </MyButton_v2>
            ),
          },
          {
            key: '2',
            label: (
              <MyButton_v2 img={iconUpload.src} onClick={showPdf_noDiscount} className={'!w-full'}>
                {'匯出報價單(無折扣)'}
              </MyButton_v2>
            ),
          },
        ],
      }}
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
      menu={{
        items: [
          {
            key: '0',
            label: (
              <MyButton_v2 className={'!w-full'} onClick={cloneQuotation}>
                一般複製
              </MyButton_v2>
            ),
          },
          {
            key: '1',
            label: (
              <MyButton_v2 className={'!w-full'} onClick={cloneQuotation_relation}>
                關聯報價
              </MyButton_v2>
            ),
          },
        ],
      }}
    >
      複製報價單
    </Dropdown>
  );
};

// ================================================================================
// ================================================================================
export { usePanel };
