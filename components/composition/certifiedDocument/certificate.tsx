import { Fragment, useState, useEffect, useCallback, useMemo, useRef, RefObject, forwardRef, memo } from 'react';
import classNames from 'classnames';
import { NextRouter, useRouter } from 'next/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import dayjs, { Dayjs } from 'dayjs';
import Decimal from 'decimal.js';
import Image, { StaticImageData } from 'next/image';

// layout
import { TtagList as TtabList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';
// import { Wrapper, Wrapper_inpuSel_01, WrappedTextarea } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// antd
import { Modal } from 'antd';

// gear
// import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel, { TinputProps, TtextareaProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';
import Textarea_autosize from 'react-textarea-autosize';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// img
import corporateSeal from 'public/image/seal/corporateSeal.png';
import factoryCertificate from 'public/image/seal/factoryCertificate.png';
import fireproofCertificate from 'public/image/seal/fireproofCertificate.png';
import warrantyCertificate from 'public/image/seal/warrantyCertificate.png';

import scss from './certificate.module.scss';

// config
import { companyInfo } from 'config/companyInfo';

// api
import {
  // TsettleProductDto,
  // TcreateCertificatedDocDto,
  TupdateCertificatedDocDto,
  TdocType,
  TcertificatedProductDto,
  TcreateCertificatedDocSnapShotDto,
  useGetCertificatedDoc_id,
  // apiPostCertificatedDoc,
  apiPatchCertificatedDoc,
  apiPatchCertificatedDoc_spanShot,
} from 'js/api/api_certificated-doc';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { fixTailwindImgDisplay } from 'js/utils/dlPdf';

// ===============================================================================

type Tquery = {
  certifiedDocumentId: string;
};

type Tinfo = {
  caption: string;
  value: string;
};

type TinfoList = {
  [key: string]: Tinfo;
};

type Titem = {
  itemName: string;
  size: string;
  qty: string;
  note: string;
};

type TitemList = {
  [settleProdId: string]: Titem;
};

// !!! 這個page的後端資料是JSON，所有的property與型別皆是在前端這邊決定 !!!
// !!! 因此不可以隨意更改Tdata型別 !!!
type Tdata = {
  infoList: TinfoList;
  description: string;
  itemList: {
    [settleProdId: string]: {
      itemName: string;
      size: string;
      note: string;
    };
  };
  issuanceDate: string | null; // 發行時間
};

// ==================================================================================

const lookup_certificateSeal = {
  防火證明: fireproofCertificate,
  出廠證明: factoryCertificate,
  保固書: warrantyCertificate,
} as const;

// ==================================================================================

// ███████ ████████  █████  ██████  ████████
// ██         ██    ██   ██ ██   ██    ██
// ███████    ██    ███████ ██████     ██
//      ██    ██    ██   ██ ██   ██    ██
// ███████    ██    ██   ██ ██   ██    ██

// 證明書

export default function Certificate({
  //
  onPanelChange,
}: {
  onPanelChange: (panelList: TpanelList | undefined) => void;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { certifiedDocumentId } = query;
  // const isNew = !certificateId;

  // const refPdf = useRef<HTMLDivElement>(null!);

  const ref_container = useRef<HTMLDivElement>(null!);
  const ref_title = useRef<HTMLDivElement>(null!);
  const ref_info = useRef<HTMLDivElement>(null!);
  const ref_table = useRef<HTMLDivElement>(null!);
  const ref_description = useRef<HTMLDivElement>(null!);
  const ref_footer = useRef<HTMLDivElement>(null!);
  const ref_tableTitle = useRef<HTMLDivElement>(null!);

  // ---------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // ---------------------------------------------------------------------
  const [state_docType, setState_docType] = useState('　');

  const [state_infoList, setState_infoList] = useState<TinfoList>({});
  const [state_itemList, setState_itemList] = useState<TitemList>({});
  const [state_description, setState_description] = useState('');
  const [state_issuanceDate, setState_issuanceDate] = useState<Dayjs | null>(null);

  const year = state_issuanceDate ? state_issuanceDate.year() - 1911 : '---';
  // const month = state_issuanceDate ? state_issuanceDate.month() + 1 : '---';
  const month = state_issuanceDate ? state_issuanceDate.format('MM') : '---';
  const date = state_issuanceDate?.date() || '---';

  // ---------------------------------------------------------------------

  const { data: data_certifiedDocument, update: update_data_CertifiedDocument } =
    useGetCertificatedDoc_id(certifiedDocumentId);

  const isSealed = data_certifiedDocument?.status === '已用印';
  const docStyle = data_certifiedDocument?.docStyle ?? '';

  const projectName = data_certifiedDocument?.contract.content.projectName ?? '';

  const certificateSeal = (docStyle && lookup_certificateSeal[docStyle]) || undefined;

  // ---------------------------------------------------------------------

  const editInfo = (key: string, value: string) => {
    setState_infoList((state) => ({
      ...state,
      [key]: {
        ...state[key],
        value,
      },
    }));
  };

  const removeInfo = (key: string) => {
    setState_infoList((state) => {
      const newState = { ...state };
      delete newState[key];

      return newState;
    });
  };

  const editItem = (id: string, key: keyof Titem, value: string) => {
    setState_itemList((state) => {
      const copy = { ...state };
      copy[id][key] = value;

      return copy;
    });
  };

  // ---------------------------------------------------------------------

  // ██████  ███████  ██████  ███████ ███████ ████████
  // ██   ██ ██      ██    ██ ██      ██         ██
  // ██████  █████   ██    ██ █████   ███████    ██
  // ██   ██ ██      ██ ▄▄ ██ ██           ██    ██
  // ██   ██ ███████  ██████  ███████ ███████    ██
  //                     ▀▀

  const reqPatchCertificatedDoc = useCallback(async () => {
    const sanpShot: Tdata = {
      infoList: state_infoList,
      itemList: state_itemList,
      description: state_description.trimEnd(),
      issuanceDate: state_issuanceDate?.toISOString() || null,
    };

    const body: TcreateCertificatedDocSnapShotDto = {
      snapShot: JSON.stringify(sanpShot),
    };

    await apiPatchCertificatedDoc_spanShot(certifiedDocumentId, body).then(() => update_data_CertifiedDocument());
    setDisabled(true);
  }, [
    //
    certifiedDocumentId,
    state_description,
    state_infoList,
    state_itemList,
    state_issuanceDate,
    update_data_CertifiedDocument,
  ]);

  // const reqSealCertificatedDoc = useCallback(async () => {
  //   const body: TupdateCertificatedDocDto = {
  //     status: '已用印',
  //   };
  //   await apiPatchCertificatedDoc(certifiedDocumentId, body).then(() => update_data_CertifiedDocument());
  // }, [certifiedDocumentId, update_data_CertifiedDocument]);

  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------

  // ███    ███ ███████ ███    ███  ██████
  // ████  ████ ██      ████  ████ ██    ██
  // ██ ████ ██ █████   ██ ████ ██ ██    ██
  // ██  ██  ██ ██      ██  ██  ██ ██    ██
  // ██      ██ ███████ ██      ██  ██████

  const panelList = usePanelList({
    router,
    disabled,
    setDiasbled: setDisabled,
    // dlPdf,
    reqPatchCertificatedDoc,
    // reqSealCertificatedDoc,
    setShowPdfPreview,
    isSealed,
  });

  // ___________________________________________________________________________
  // ___________________________________________________________________________

  const tableProps: Ttable = useMemo(() => {
    const thead: Ttable['thead'] = {
      rowProps: {
        minHeight: tableConfig.row.minHeight,
      },
      cellArr: [
        {
          children: cellConfig.itemName.label,
          ...cellConfig.itemName,
        },
        {
          children: cellConfig.size.label,
          ...cellConfig.size,
        },
        {
          children: cellConfig.qty.label,
          ...cellConfig.qty,
        },
        {
          children: cellConfig.note.label,
          ...cellConfig.note,
        },
      ],
    };

    const bodyRowArr: Ttable['tbody']['rowArr'] = Object.entries(state_itemList).map(([id, item], index) => {
      // html2canvas在擷取HTML時textarea與input會跑版
      // 因此要匯出時要將input與textarea的value顯示在suffix
      // _________________________________________________________________________
      // _________________________________________________________________________
      const inputProps_itemName: TtextareaProps | undefined = disabled
        ? undefined
        : {
            props: {
              className: scss.inputTextArea,
              value: item.itemName,
              onChange: (e) => {
                editItem(id, 'itemName', e.target.value);
              },
            },
          };
      const suffix_itemName = disabled ? item.itemName : undefined;

      // _________________________________________________________________________
      // _________________________________________________________________________
      const inputProps_size: TinputProps | undefined = disabled
        ? undefined
        : {
            props: {
              className: cellConfig.size.className,
              value: item.size,
              onChange: (e) => {
                editItem(id, 'size', e.target.value);
              },
            },
          };
      const suffix_size = disabled ? item.size : undefined;
      // _________________________________________________________________________
      // _________________________________________________________________________

      const inputSize_note: TtextareaProps | undefined = disabled
        ? undefined
        : {
            props: {
              className: scss.inputTextArea,
              value: item.note,
              onChange: (e) => {
                editItem(id, 'note', e.target.value);
              },
            },
          };
      const suffix_note = disabled ? item.note : undefined;

      // _________________________________________________________________________
      // _________________________________________________________________________

      return {
        minHeight: tableConfig.row.minHeight,
        props: {
          id,
        },
        cellArr: [
          {
            children: (
              <InputSel
                //
                className={classNames(scss.inputSel)}
                disabled={disabled}
                fontSize={'20'}
                showBaseline="auto"
                textareaProps={inputProps_itemName}
                suffix={suffix_itemName}
                suffixClassName={scss.infoSuffix}
              />
            ),
            ...cellConfig.itemName,
            ...cellConfig.itemName.tbody,
          },
          {
            children: (
              <InputSel
                //
                className={classNames(scss.inputSel)}
                disabled={disabled}
                fontSize={'20'}
                showBaseline="auto"
                inputProps={inputProps_size}
                suffix={suffix_size}
                suffixClassName={scss.infoSuffix}
              />
            ),
            ...cellConfig.size,
            ...cellConfig.size.tbody,
          },
          {
            children: `${item.qty}樘`,
            ...cellConfig.qty,
            ...cellConfig.qty.tbody,
          },
          {
            children: (
              <InputSel
                //
                className={classNames(scss.inputSel)}
                fontSize={'20'}
                disabled={disabled}
                showBaseline="auto"
                textareaProps={inputSize_note}
                suffix={suffix_note}
                suffixClassName={scss.infoSuffix}
              />
            ),
            ...cellConfig.note,
            ...cellConfig.note.tbody,
          },
        ],
      };
    });

    return {
      thead,
      tbody: {
        rowArr: bodyRowArr,
      },
    };
  }, [state_itemList, disabled]);

  // ---------------------------------------------------------------------

  useEffect(() => {
    update_data_CertifiedDocument();
  }, [certifiedDocumentId]);

  useEffect(() => {
    const {
      snapShot,
      products,
      docStyle = '',
      // status
    } = data_certifiedDocument ?? {};
    // const isSealed = status === '已印出';
    const data_certificate = snapShot ? (JSON.parse(snapShot) as Tdata) : undefined;
    const docType = docStyle ? lookup_docType[docStyle] : '';

    // 先將products以settleProdId為依據合併
    const certificatedProductList: { [settleProdId: string]: TcertificatedProductDto } = {};
    products?.forEach((prod) => {
      if (!certificatedProductList[prod.id]) {
        certificatedProductList[prod.id] = prod;
      } else {
        certificatedProductList[prod.id].quantity += prod.quantity;
      }
    });

    // certificatedProductList與itemList彙整
    // 其中qty必須要從certificatedProductList取得
    // qty預期會因編輯證明文件的product而改變
    const list: TitemList = {};

    Object.values(certificatedProductList)?.forEach((prod) => {
      const { id: prodId } = prod;
      const { itemName, size, note = '' } = data_certificate?.itemList[prodId] ?? {};

      const size_ori = calcSize({
        fullWidth: prod.fullWidth,
        height: prod.height,
        boxB: prod.boxB,
      });

      list[prod.id] = {
        itemName: itemName || prod.itemName,
        size: size || size_ori,
        qty: `${prod.quantity}`,
        note: note,
      };
    });

    setState_docType(docType || '　');
    setState_itemList(list);

    if (data_certificate) {
      const issuanceDate = data_certificate.issuanceDate ? dayjs(data_certificate.issuanceDate) : null;

      setState_infoList(data_certificate.infoList);
      setState_description(data_certificate.description);
      setState_issuanceDate(issuanceDate);
    } else {
      setState_infoList(defaultInfo());
      setState_description(descriptionTemp());
      setState_issuanceDate(null);
    }

    //
  }, [data_certifiedDocument, disabled]);

  useEffect(() => {
    onPanelChange(panelList);

    return () => {
      onPanelChange(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelList]);

  // ---------------------------------------------------------------------

  // ██████  ███████ ███    ██ ██████  ███████ ██████
  // ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  // ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  // ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  // ██   ██ ███████ ██   ████ ██████  ███████ ██   ██

  return (
    <div>
      <div ref={ref_container} className={classNames(scss.container)}>
        <h1 ref={ref_title} className={classNames(scss.title)}>
          {state_docType}
        </h1>

        <div ref={ref_info} className={scss.infoList}>
          <div className={classNames(scss.infoBar)}>
            <div />
            <IconAddCircle
              className={classNames(scss.addBtn, disabled && 'invisible')}
              onClick={() => setShowModal(true)}
            />
          </div>
          {Object.entries(state_infoList).map(([key, info]) => {
            const inputProps: TinputProps | undefined = disabled
              ? undefined
              : {
                  props: {
                    value: info.value,
                    onChange: (e) => {
                      editInfo(key, e.target.value);
                    },
                    style: {
                      fontSize: '30px',
                    },
                  },
                };

            const suffix = disabled ? info.value : undefined;

            return (
              <div key={key} className={classNames(scss.infoBar, 'mb-3')}>
                <IconRemoveCircle
                  className={classNames(scss.removeBtn, disabled && 'invisible')}
                  onClick={() => removeInfo(key)}
                />
                <InputSel
                  disabled={disabled}
                  showBaseline="auto"
                  caption={info.caption}
                  captionStyle={{ width: '120px', fontSize: '30px' }}
                  inputProps={inputProps}
                  suffix={suffix}
                  suffixClassName={scss.suffix}
                />
              </div>
            );
          })}
        </div>

        <div ref={ref_table} className={scss.tableWrapper}>
          <div ref={ref_tableTitle}>
            <InputSel
              //
              className={scss.tableCaption}
              captionStyle={{ width: '120px', fontSize: '30px' }}
              disabled={disabled}
              caption={'承攬項目'}
              showBaseline="invisible"
            />
          </div>
          <Table01 className={scss.table} {...tableProps} />
        </div>

        {/*     
      // html2canvas在擷取HTML時textarea與input會跑版
      // 因此要匯出時要將input與textarea的value放在非input與textarea的元素
       */}
        {!disabled && (
          <Textarea_autosize
            //
            className={classNames(scss.textarea)}
            value={state_description}
            onChange={(e) => {
              setState_description(e.target.value);
            }}
          />
        )}
        {disabled && (
          <div ref={ref_description} className={classNames(scss.textarea, scss.div)}>
            {state_description}
          </div>
        )}

        <div ref={ref_footer} className={scss.footer}>
          <div>台中總公司：{companyInfo.headOffice.wholeAddress}</div>
          <div>TEL：{companyInfo.headOffice.tel}</div>
          <div>台北分公司：{companyInfo.taipeiOffice.wholeAddress}</div>
          <div>TEL：{companyInfo.taipeiOffice.tel}</div>
          <div className={scss.footerDate}>
            {disabled && (
              <span>
                中華民國 {year} 年 {month} 月 {date} 日
              </span>
            )}

            {!disabled && (
              <InputSel
                caption="中華民國年月日"
                //
                captionStyle={{ fontSize: '30px' }}
                wrapperStyle={{ width: '500px', margin: 'auto' }}
                datePickerProps={{
                  props: {
                    className: scss.datePicker,
                    value: state_issuanceDate,
                    onChange: (m) => {
                      setState_issuanceDate(m);
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        {/* {isSealed && <FakeSeal className={scss.seal} />} */}
        {isSealed && <Image src={corporateSeal} alt="公司印章" className={scss.seal} />}
        {isSealed && certificateSeal && <Image src={certificateSeal} alt="證明書章" className={scss.seal2} />}

        {/*  */}
        <InputModal
          //
          open={showModal}
          title="新增資訊"
          onConfirm={(str) => {
            setState_infoList((prev) => ({ ...prev, [str]: { caption: str, value: '' } }));
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />

        <PdfPreview
          visible={showPdfPreview}
          closeModal={() => setShowPdfPreview(false)}
          //
          // ref_container={ref_container}
          ref_title={ref_title}
          ref_info={ref_info}
          ref_description={ref_description}
          ref_footer={ref_footer}
          ref_table={ref_table}
          ref_tableTitle={ref_tableTitle}
          //
          state_itemList={state_itemList}
          state_docType={state_docType}
          state_infoList={state_infoList}
          state_description={state_description}
          year={year}
          month={month}
          date={date}
          isSealed={isSealed}
          projectName={projectName}
          docStyle={docStyle}
          certificateSeal={certificateSeal}
        />
      </div>
    </div>
  );
}

// ███████ ███    ██ ██████
// ██      ████   ██ ██   ██
// █████   ██ ██  ██ ██   ██
// ██      ██  ██ ██ ██   ██
// ███████ ██   ████ ██████

// ===============================================================================

// ██   ██  ██████   ██████  ██   ██
// ██   ██ ██    ██ ██    ██ ██  ██
// ███████ ██    ██ ██    ██ █████
// ██   ██ ██    ██ ██    ██ ██  ██
// ██   ██  ██████   ██████  ██   ██

const usePanelList = ({
  //
  router,
  disabled,
  setDiasbled,
  reqPatchCertificatedDoc,
  // reqSealCertificatedDoc,
  setShowPdfPreview,
  isSealed,
}: {
  router: NextRouter;
  disabled: boolean;
  setDiasbled: React.Dispatch<React.SetStateAction<boolean>>;
  reqPatchCertificatedDoc: () => void;
  // reqSealCertificatedDoc: () => void;
  setShowPdfPreview: React.Dispatch<React.SetStateAction<boolean>>;
  isSealed: boolean;
}) => {
  const panelList: TpanelList = useMemo(() => {
    //
    // const btn_toSeal: TpanelList[number] = {
    //   type: 'redButton',
    //   label: '用印',
    //   onClick: reqSealCertificatedDoc,
    // };

    const btn_edit: TpanelList[number] = {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDiasbled(false);
      },
    };

    const btn_isSealed: TpanelList[number] = {
      type: 'redButton',
      label: '已用印',
      onClick: () => {},
    };

    const panelList_disabled: TpanelList = [
      !isSealed ? null : btn_isSealed,
      {
        type: 'redButton',
        label: '匯出',
        onClick: () => {
          setShowPdfPreview(true);
        },
      },
      !isSealed ? btn_edit : null,
      {
        type: 'myButton',
        label: '返回',
        onClick: router.back,
      },
    ];

    const panelList_abled: TpanelList = [
      {
        type: 'redButton',
        label: '確認',
        onClick: reqPatchCertificatedDoc,
      },
      {
        type: 'myButton',
        label: '取消',
        onClick: () => {
          setDiasbled(true);
        },
      },
    ];

    // if (isNew) {
    //   return panelList_new;
    // }

    if (disabled) {
      return panelList_disabled;
    } else {
      return panelList_abled;
    }
  }, [
    //
    disabled,
    reqPatchCertificatedDoc,
    // reqSealCertificatedDoc,
    router.back,
    setDiasbled,
    setShowPdfPreview,
    isSealed,
  ]);

  return panelList;
};

// ===============================================================================

//  ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
// ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
// ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
// ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
//  ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██

const VirtualContainer_pre = (
  {
    //
    state_docType,
    state_infoListArr,
    state_description,
    state_itemArr,
    year,
    month,
    date,
    isSealed,
    certificateSeal,
  }: {
    state_docType: React.ReactNode;
    state_infoListArr: Tinfo[];
    state_description: string;
    state_itemArr: Titem[];
    year: React.ReactNode;
    month: React.ReactNode;
    date: React.ReactNode;
    isSealed: boolean;
    certificateSeal: StaticImageData | undefined;
  },
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const tableProps: Ttable = useMemo(() => {
    const thead: Ttable['thead'] = {
      rowProps: {
        minHeight: tableConfig.row.minHeight,
      },
      cellArr: [
        {
          children: cellConfig.itemName.label,
          ...cellConfig.itemName,
        },
        {
          children: cellConfig.size.label,
          ...cellConfig.size,
        },
        {
          children: cellConfig.qty.label,
          ...cellConfig.qty,
        },
        {
          children: cellConfig.note.label,
          ...cellConfig.note,
        },
      ],
    };

    const bodyRowArr: Ttable['tbody']['rowArr'] = state_itemArr.map((item, index) => {
      const suffix_itemName = item.itemName;
      const suffix_size = item.size;
      const suffix_note = item.note;

      return {
        minHeight: tableConfig.row.minHeight,
        cellArr: [
          {
            children: (
              <InputSel
                //
                className={classNames(scss.inputSel)}
                fontSize={'20'}
                suffixClassName={scss.infoSuffix}
                disabled={true}
                showBaseline="auto"
                // inputProps={inputProps_itemName}
                suffix={suffix_itemName}
              />
            ),
            ...cellConfig.itemName,
          },
          {
            children: (
              <InputSel
                //
                className={classNames(scss.inputSel)}
                fontSize={'20'}
                suffixClassName={scss.infoSuffix}
                disabled={true}
                showBaseline="auto"
                // inputProps={inputProps_size}
                suffix={suffix_size}
              />
            ),
            ...cellConfig.size,
          },
          {
            children: `${item.qty}樘`,
            ...cellConfig.qty,
          },
          {
            children: (
              <InputSel
                //
                className={classNames(scss.inputSel)}
                fontSize={'20'}
                suffixClassName={scss.infoSuffix}
                disabled={true}
                showBaseline="auto"
                // inputProps={inputSize_note}
                suffix={suffix_note}
              />
            ),
            ...cellConfig.note,
          },
        ],
      };
    });

    return {
      thead,
      tbody: {
        rowArr: bodyRowArr,
      },
    };
  }, [state_itemArr]);

  const description = useMemo(() => {
    let qty = 0;
    state_itemArr.forEach((item) => {
      qty = qty + Number(item.qty);
    });

    const description = state_description?.replaceAll('${qty}', String(qty));

    return description;
  }, [state_itemArr]);

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  return (
    <div ref={ref} className={classNames(scss.container, scss.pdfContainer)}>
      <h1 className={classNames(scss.title)}>{state_docType}</h1>

      <div className={scss.infoList}>
        <div className={classNames(scss.infoBar)}>
          <div />
          <IconAddCircle className={classNames(scss.addBtn, 'invisible')} />
        </div>
        {state_infoListArr.map((info, index) => {
          const suffix = info.value;

          return (
            <div key={index} className={classNames(scss.infoBar, 'mb-3')}>
              <IconRemoveCircle className={classNames(scss.removeBtn, 'invisible')} />
              <InputSel
                disabled={true}
                showBaseline="auto"
                caption={info.caption}
                captionStyle={{ width: '120px', fontSize: '30px' }}
                // inputProps={inputProps}
                suffix={suffix}
                suffixClassName={scss.suffix}
              />
            </div>
          );
        })}
      </div>

      <div className={scss.tableWrapper}>
        <div>
          <InputSel
            //
            className={scss.tableCaption}
            captionStyle={{ width: '120px', fontSize: '30px' }}
            disabled={true}
            caption={'承攬項目'}
            showBaseline="invisible"
          />
        </div>
        <Table01 className={scss.table} {...tableProps} />
      </div>

      <div className={classNames(scss.textarea, scss.div)}>{description}</div>

      <div className={scss.footer}>
        <div>台中總公司：{companyInfo.headOffice.wholeAddress}</div>
        <div>TEL：{companyInfo.headOffice.tel}</div>
        <div>台北分公司：{companyInfo.taipeiOffice.wholeAddress}</div>
        <div>TEL：{companyInfo.taipeiOffice.tel}</div>
        <div className={scss.footerDate}>
          <span>
            中華民國 {year} 年 {month} 月 {date} 日
          </span>
        </div>
      </div>

      {/* {isSealed && <FakeSeal className={scss.seal} />} */}
      {isSealed && <Image src={corporateSeal} alt="公司印章" className={scss.seal} />}
      {isSealed && certificateSeal && <Image src={certificateSeal} alt="證明書章" className={scss.seal2} />}
      {/*  */}
    </div>
  );
};

const VirtualContainer = forwardRef(VirtualContainer_pre);

// ██████  ██████  ███████ ██████  ██████  ███████ ██    ██ ██ ███████ ██     ██
// ██   ██ ██   ██ ██      ██   ██ ██   ██ ██      ██    ██ ██ ██      ██     ██
// ██████  ██   ██ █████   ██████  ██████  █████   ██    ██ ██ █████   ██  █  ██
// ██      ██   ██ ██      ██      ██   ██ ██       ██  ██  ██ ██      ██ ███ ██
// ██      ██████  ██      ██      ██   ██ ███████   ████   ██ ███████  ███ ███

const PdfPreview_pre = ({
  visible,
  closeModal,
  //
  // ref_container,
  ref_title,
  ref_info,
  ref_description,
  ref_footer,
  ref_table,
  ref_tableTitle,
  state_itemList,
  //
  state_docType,
  state_infoList,
  state_description,
  year,
  month,
  date,
  isSealed,
  projectName,
  docStyle,
  certificateSeal,
}: {
  visible: boolean;
  closeModal: () => void;
  //
  // ref_container: MutableRefObject<HTMLDivElement>;
  ref_title: RefObject<HTMLDivElement>;
  ref_info: RefObject<HTMLDivElement>;
  ref_description: RefObject<HTMLDivElement>;
  ref_footer: RefObject<HTMLDivElement>;
  ref_table: RefObject<HTMLDivElement>;
  ref_tableTitle: RefObject<HTMLDivElement>;
  state_itemList: TitemList;
  //
  state_docType: React.ReactNode;
  state_infoList: TinfoList;
  state_description: string;
  year: React.ReactNode;
  month: React.ReactNode;
  date: React.ReactNode;
  isSealed: boolean;
  projectName: string;
  docStyle: string;
  certificateSeal: StaticImageData | undefined;
}) => {
  //
  const refPdf = useRef<(HTMLDivElement | null)[]>([]);

  const [state_itemArrArr, setState_itemArrArr] = useState<Titem[][]>([]);

  // ----------------------------------------------------------------------------

  const dlPdf = async () => {
    if (!refPdf.current[0]) {
      return;
    }

    showRootLoading(true, '正在處理PDF');

    const doc = new jsPDF('p', 'px', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();

    let isFirst = true;
    let item;

    await fixTailwindImgDisplay(async () => {
      for (item of refPdf.current) {
        if (!item) {
          continue;
        }

        const image = await html2canvas(item, {
          scale: 3,
          // useCORS: true,
          // allowTaint: true,
        }).then((canvas) => {
          const image = canvas.toDataURL('image/JPEG');

          return image;
        });

        if (!isFirst) {
          doc.addPage();
        }

        isFirst = false;
        // 留作參考
        // doc.addImage(image, "JPEG", 0, 0, 595, 842);
        // doc.addImage(image, "JPEG", 0, 0, canvas.width, canvas.height);
        doc.addImage(image, 'JPEG', 0, 0, pageWidth, pageHeight);
      }
    });

    doc.save(`${docStyle}證明書_${projectName}.pdf`);
    showRootLoading(false);
  };

  // ----------------------------------------------------------------------------
  // const width = 1500; // 寬度，設定在css裡
  // const fullHeight = width / (210 / 297); // A4比例
  // const height_container = fullHeight - 100 - 100 - 1 - 1; // 上下的padding與border 設定在css裡
  // 改用Decimal.js處理
  const width = new Decimal(1500);
  const fullHeight = width.div(210).times(297);
  const height_container = fullHeight.minus(100).minus(100).minus(1).minus(1).toNumber();

  useEffect(() => {
    if (!visible) {
      return;
    }

    const calcChopedItemArr = () => {
      let hadAlert = false;
      //
      const style_description = window.getComputedStyle(ref_description.current);
      const style_table = window.getComputedStyle(ref_table.current);
      const style_tableTitle = window.getComputedStyle(ref_tableTitle.current);

      const height_title = ref_title.current.offsetHeight;

      const height_info = ref_info.current.offsetHeight;

      const marginTop_table = parseFloat(style_table.marginTop);
      const height_thead = ref_table.current.querySelector('thead')?.offsetHeight || 0;

      // const height_tableTitle = ref_tableTitle.current.offsetHeight;
      const height_tableTitle = parseFloat(style_tableTitle.height);
      const marginBottom_tableTitle = parseFloat(style_tableTitle.marginBottom);

      const marginTop_description = parseFloat(style_description.marginTop);
      const marginBottom_description = parseFloat(style_description.marginBottom);
      const height_description = parseFloat(style_description.height);

      const height_footer = ref_footer.current.offsetHeight;

      // const height_table = parseFloat(style_table.height);

      const allowHeight = new Decimal(height_container)
        .minus(height_title)
        .minus(height_info)
        .minus(marginTop_table)
        .minus(height_tableTitle)
        .minus(marginBottom_tableTitle)
        .minus(height_thead)
        .minus(marginTop_description)
        .minus(marginBottom_description)
        .minus(height_description)
        .minus(height_footer)
        .toNumber();

      const rowEleArr = ref_table.current.querySelectorAll("[data-component='Row'") as NodeListOf<HTMLDivElement>;
      const chopedRowArr: Titem[][] = [];
      let tempArr: Titem[] = [];
      let countHeight = 0;

      rowEleArr.forEach((ele, index) => {
        const item = state_itemList[ele.id];

        tempArr.push(item);
        const height = ele.offsetHeight;
        countHeight = countHeight + height;

        if (countHeight > allowHeight) {
          tempArr.pop();
          chopedRowArr.push(tempArr);
          // tempArr = [];
          // countHeight = 0;
          // tempArr.push(ele);
          // countHeight = countHeight + height;
          tempArr = [item];
          countHeight = height;

          if (height > allowHeight && !hadAlert) {
            myAlert.warning({ title: '注意，有資料過高超出可處理範圍，請調整資料內容' });
            hadAlert = true;
          }
        }

        if (index === rowEleArr.length - 1) {
          chopedRowArr.push(tempArr);
        }
      }); // foreach

      setState_itemArrArr(chopedRowArr);
    }; // calcChopedItemArr

    if (window) {
      calcChopedItemArr();
    }

    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // height_container,
    // ref_description,
    // ref_footer,
    // ref_info,
    // ref_table,
    // ref_tableTitle,
    // ref_title,
    // state_itemList,
    visible,
  ]);

  const state_infoListArr = useMemo(() => {
    return Object.values(state_infoList);
  }, [state_infoList]);

  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={closeModal}
      //
      width={'fit-content'}
    >
      <div>
        <MyButton_v2 onClick={dlPdf}>下載PDF</MyButton_v2>
        <br />
        <br />
        {state_itemArrArr.map((arr, index) => {
          return (
            <Fragment key={index}>
              <VirtualContainer
                ref={(ele) => {
                  refPdf.current[index] = ele;
                }}
                state_docType={state_docType}
                state_infoListArr={state_infoListArr}
                state_description={state_description}
                state_itemArr={arr}
                year={year}
                month={month}
                date={date}
                isSealed={isSealed}
                certificateSeal={certificateSeal}
              />
              <br />
            </Fragment>
          );
        })}
      </div>
    </Modal>
  );
};

const PdfPreview = memo(PdfPreview_pre, (preState, nextState) => {
  return preState.visible === nextState.visible;
});

// ===============================================================================

//  ██████  ██████  ███    ██ ███████ ██  ██████
// ██      ██    ██ ████   ██ ██      ██ ██
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██
//  ██████  ██████  ██   ████ ██      ██  ██████

type TcellKeyArr = 'itemName' | 'size' | 'qty' | 'note';

const tableConfig = {
  row: {
    minHeight: '40px',
  },
};

const cellConfig: { [key in TcellKeyArr]: Tconfig_table } = {
  itemName: {
    label: '項目',
    flex: '0 0 25%',
    justifyContent: 'center',
    className: classNames('text-center'),
    tbody: {
      className: classNames('text-center', scss.cellspan, scss.plus),
    },
  },
  size: {
    label: '尺寸',
    flex: '0 0 25%',
    justifyContent: 'center',
    className: classNames('text-center'),
    tbody: {
      className: classNames('text-center', scss.cellspan, scss.plus),
    },
  },
  qty: {
    label: '數量',
    flex: '0 0 25%',
    justifyContent: 'center',
    className: classNames('center'),
    tbody: {
      className: classNames('text-center'),
    },
  },
  note: {
    label: '備註',
    flex: '0 0 25%',
    justifyContent: 'center',
    className: classNames('text-center'),
    tbody: {
      className: classNames('text-center', scss.cellspan, scss.plus),
    },
  },
};

const descriptionTemp = () => {
  return '共計 ${qty} 樘之製造及按裝，特立此書以茲證明\n＊本證明書無公司章及影印均無效！\n三久建材工業股份有限公司';
};

const lookup_docType: { [key in TdocType]: string } = {
  防火證明: '防火證明書',
  出廠證明: '出廠證明書',
  保固書: '保固書',
};

const defaultInfo = () => ({
  工程名稱: {
    caption: '工程名稱',
    value: '',
  },
  建築地號: {
    caption: '建築地號',
    value: '',
  },
  建照號碼: {
    caption: '建照號碼',
    value: '',
  },
  業主名稱: {
    caption: '業主名稱',
    value: '',
  },
  承造人: {
    caption: '承造人',
    value: '',
  },
  施工廠商: {
    caption: '施工廠商',
    value: '',
  },
});

// ███████  █████  ██   ██ ███████     ██████   █████  ████████  █████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// █████   ███████ █████   █████       ██   ██ ███████    ██    ███████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// ██      ██   ██ ██   ██ ███████     ██████  ██   ██    ██    ██   ██

const FakeSeal = ({ className }: { className?: string }) => {
  return (
    <div className={classNames(className)}>
      <svg width="300px" height="300px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5 0C3.89543 0 3 0.895431 3 2V3C3 4.10457 3.89543 5 5 5C6.10457 5 7 4.10457 7 3V2C7 0.895431 6.10457 0 5 0Z"
          fill="#FFC0CB"
        />
        <path
          d="M10 0C8.89543 0 8 0.895431 8 2V3C8 4.10457 8.89543 5 10 5C11.1046 5 12 4.10457 12 3V2C12 0.895431 11.1046 0 10 0Z"
          fill="#FFC0CB"
        />
        <path
          d="M2 5C0.895431 5 0 5.89543 0 7V7.5C0 8.60457 0.895431 9.5 2 9.5C3.10457 9.5 4 8.60457 4 7.5V7C4 5.89543 3.10457 5 2 5Z"
          fill="#FFC0CB"
        />
        <path
          d="M13 5C11.8954 5 11 5.89543 11 7V7.5C11 8.60457 11.8954 9.5 13 9.5C14.1046 9.5 15 8.60457 15 7.5V7C15 5.89543 14.1046 5 13 5Z"
          fill="#FFC0CB"
        />
        <path
          d="M9.61273 7.77893C8.51793 6.44953 6.48207 6.44953 5.38727 7.77893L2.46943 11.322C1.2614 12.7889 2.30486 15 4.20516 15C4.47668 15 4.74447 14.9368 4.98732 14.8154L5.34699 14.6355C6.70234 13.9578 8.29766 13.9578 9.65301 14.6355L10.0127 14.8154C10.2555 14.9368 10.5233 15 10.7948 15C12.6951 15 13.7386 12.7889 12.5306 11.322L9.61273 7.77893Z"
          fill="#FFC0CB"
        />
      </svg>
    </div>
  );
};

const calcSize = ({ fullWidth, height, boxB }: { fullWidth: number; height: number; boxB: number | null }) => {
  const fullWidth_cm = new Decimal(fullWidth).div(10).toNumber();
  const height_cm = new Decimal(height).div(10).toNumber();

  let size = `${fullWidth_cm} * ${height_cm}`;

  if (boxB !== null) {
    const boxB_cm = new Decimal(boxB).div(10).toNumber();
    size = `${size} + ${boxB_cm}`;
  }

  return size;
};
