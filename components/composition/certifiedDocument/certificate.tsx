import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { NextRouter, useRouter } from 'next/router';

// layout
import { TtagList as TtabList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';
// import { Wrapper, Wrapper_inpuSel_01, WrappedTextarea } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// gear
// import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal_v2';
import Textarea_autosize from 'react-textarea-autosize';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

import scss from './certificate.module.scss';

// ===============================================================================

// ===============================================================================

type Tquery = {
  certificateId: string | undefined;
  certifiedDocumentId: string;
};

// !!! 這個page的後端資料是JSON，所有的property與型別皆是在前端這邊決定 !!!
// !!! 因此不可以隨意更改property與型別 !!!

type Tinfo = {
  caption: string;
  value: string;
};

type TinfoList = {
  [key: string]: Tinfo;
};

type TitemInfo = {
  itemName: string;
  size: string;
  qty: string;
  remark: string;
};

type Tdata = {
  infoList: TinfoList;
  itemInfoArr: TitemInfo[];
  description: string;
};

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
  onPanelChange: (panelList: TpanelList) => void;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { certificateId, certifiedDocumentId } = query;
  const isNew = !certificateId;

  // ---------------------------------------------------------------------
  const [disabled, setDisabled] = useState(false);

  // ---------------------------------------------------------------------

  const [showModal, setShowModal] = useState(false);

  // ---------------------------------------------------------------------
  const [state_infoList, setState_infoList] = useState<TinfoList>({});
  const [state_itemArr, setState_itemArr] = useState<TitemInfo[]>([]);
  const [state_description, setState_description] = useState('');

  // ---------------------------------------------------------------------

  const { data: data_certificate, update: update_certificate } = useFakeApiGetCertificate('fakeId');

  // ---------------------------------------------------------------------

  const {} = usePanelList({
    router,
    isNew,
    disabled,
    setDiasbled: setDisabled,
  });

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

  const editItem = (index: number, key: TcellKeyArr, value: string) => {
    setState_itemArr((state) => {
      const newState = [...state];
      newState[index] = {
        ...newState[index],
        [key]: value,
      };

      return newState;
    });
  };

  const addItem = () => {
    setState_itemArr((state) => [...state, { itemName: '', size: '', qty: '', remark: '' }]);
  };

  // ---------------------------------------------------------------------

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
          children: cellConfig.remark.label,
          ...cellConfig.remark,
        },
      ],
    };

    const bodyRowArr: Ttable['tbody']['rowArr'] = state_itemArr.map((item, index) => {
      return {
        minHeight: tableConfig.row.minHeight,
        cellArr: [
          {
            // children: item.itemName,
            children: (
              <InputSel
                inputProps={{
                  props: {
                    className: cellConfig.itemName.className,
                    value: item.itemName,
                    onChange: (e) => {
                      editItem(index, 'itemName', e.target.value);
                    },
                  },
                }}
              />
            ),
            ...cellConfig.itemName,
          },
          {
            children: (
              <InputSel
                inputProps={{
                  props: {
                    className: cellConfig.size.className,
                    value: item.size,
                    onChange: (e) => {
                      editItem(index, 'size', e.target.value);
                    },
                  },
                }}
              />
            ),
            ...cellConfig.size,
          },
          {
            children: item.qty,
            ...cellConfig.qty,
          },
          {
            children: item.remark,
            ...cellConfig.remark,
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

  // ---------------------------------------------------------------------

  useEffect(() => {
    update_certificate();
  }, []);

  useEffect(() => {
    if (data_certificate) {
      setState_infoList(data_certificate.infoList);
      setState_itemArr(data_certificate.itemInfoArr);
      setState_description(data_certificate.description);
    } else {
      setState_infoList({});
      setState_itemArr([]);
      setState_description(descriptionTemp(99));
    }
  }, [data_certificate, disabled]);

  // ---------------------------------------------------------------------

  // ██████  ███████ ███    ██ ██████  ███████ ██████
  // ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  // ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  // ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  // ██   ██ ███████ ██   ████ ██████  ███████ ██   ██

  return (
    <div className={scss.container}>
      <h1 className={classNames(scss.title)}>{'防火證明書'}</h1>

      <div className={scss.infoList}>
        <div className={classNames(scss.infoBar)}>
          <div />
          <IconAddCircle
            className={classNames(scss.addBtn, disabled && 'invisible')}
            onClick={() => setShowModal(true)}
          />
        </div>
        {Object.entries(state_infoList).map(([key, info]) => {
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
                captionStyle={{ width: '120px' }}
                inputProps={{
                  props: {
                    // disabled: false,
                    // readOnly: disabled,
                    value: info.value,
                    onChange: (e) => {
                      editInfo(key, e.target.value);
                    },
                  },
                }}
              />
            </div>
          );
        })}
      </div>

      <div className={scss.tableWrapper}>
        <InputSel
          //
          className={scss.tableCaption}
          disabled={disabled}
          showBaseline="invisible"
          caption={'承攬項目'}
          captionStyle={{ width: '120px' }}
        />
        <Table01 className={scss.table} {...tableProps} />
      </div>

      <Textarea_autosize
        //
        className={classNames(scss.textarea_autosize, disabled && scss.disabled)}
        minRows={8}
        value={state_description}
        onChange={(e) => {
          setState_description(e.target.value);
        }}
      />

      <div className={scss.footer}>
        <div>台中總公司：台中市霧峰區峰北路666號</div>
        <div>TEL:04-2406-9939</div>
        <div>台北分公司：台北市內湖路一段387巷5號2F之2</div>
        <div>TEL:02-2658-1508</div>
        <div className={scss.footerDate}>
          中華民國 {999} 年 {99} 月 {99} 日
        </div>
      </div>

      {/*  */}
      <InputModal
        //
        visible={showModal}
        title="新增資訊"
        onConfirm={(str) => {
          setState_infoList((prev) => ({ ...prev, [str]: { caption: str, value: '' } }));
          setShowModal(false);
        }}
        onCancel={() => setShowModal(false)}
      />
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
  isNew,
  disabled,
  setDiasbled,
}: {
  router: NextRouter;
  isNew: boolean;
  disabled: boolean;
  setDiasbled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const panelList: TpanelList = useMemo(() => {
    const panelList_new: TpanelList = [
      {
        type: 'redButton',
        label: '確認',
        onClick: () => {
          alert('確認');
        },
      },
      {
        type: 'myButton',
        label: '返回',
        onClick: router.back,
      },
    ];

    const panelList_disabled: TpanelList = [
      {
        type: 'redButton',
        label: '用印',
        onClick: () => {
          alert('用印');
        },
      },
      {
        type: 'redButton',
        label: '匯出',
        onClick: () => {
          alert('匯出');
        },
      },
      {
        type: 'myButton',
        label: '編輯',
        onClick: () => {
          setDiasbled(false);
        },
      },
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
        onClick: () => {
          alert('確認');
        },
      },
      {
        type: 'myButton',
        label: '取消',
        onClick: () => {
          setDiasbled(true);
        },
      },
    ];

    if (isNew) {
      return panelList_new;
    }

    if (disabled) {
      return panelList_disabled;
    } else {
      return panelList_abled;
    }
  }, [isNew]);

  return panelList;
};

// ===============================================================================

//  ██████  ██████  ███    ██ ███████ ██  ██████
// ██      ██    ██ ████   ██ ██      ██ ██
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██
//  ██████  ██████  ██   ████ ██      ██  ██████

type TcellKeyArr = 'itemName' | 'size' | 'qty' | 'remark';

const tableConfig = {
  row: {
    minHeight: '40px',
  },
};

const cellConfig: { [key in TcellKeyArr]: Tconfig_table } = {
  itemName: {
    label: '項目',
    flex: 0.25,
    justifyContent: 'center',
    className: 'text-center',
  },
  size: {
    label: '尺寸',
    flex: 0.25,
    justifyContent: 'center',
    className: 'text-center',
  },
  qty: {
    label: '數量',
    flex: 0.25,
    justifyContent: 'center',
  },
  remark: {
    label: '備註',
    flex: 0.25,
    justifyContent: 'center',
  },
};

// ███████  █████  ██   ██ ███████     ██████   █████  ████████  █████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// █████   ███████ █████   █████       ██   ██ ███████    ██    ███████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// ██      ██   ██ ██   ██ ███████     ██████  ██   ██    ██    ██   ██

const createEmptyData = () => ({
  infoList: {},
  itemInfoArr: [],
  description: '',
});

const descriptionTemp = (qty: string | number) => {
  return `共計 ${qty} 樘之製造及按裝，特立此書以茲證明\n＊本證明書無公司章及影印均無效！\n三久建材工業股份有限公司`;
};

const createFakeData = () => ({
  infoList: {
    工程名稱: {
      caption: '工程名稱',
      value: 'aaaaa',
    },
    建築地號: {
      caption: '建築地號',
      value: 'bbbbbb',
    },
    建照號碼: {
      caption: '建照號碼',
      value: 'ccccc',
    },
    業主名稱: {
      caption: '業主名稱',
      value: 'dddd',
    },
  },
  itemInfoArr: [
    {
      itemName: 'SD-1',
      size: '999 * 999 + 999',
      qty: '99',
      remark: 'aaaa',
    },
    {
      itemName: 'SD-2',
      size: '977 * 999 + 999',
      qty: '88',
      remark: 'BBB',
    },
    {
      itemName: 'SD-3',
      size: '988 * 999 + 999',
      qty: '77',
      remark: 'CCCC',
    },
  ],
  description: `喵喵喵喵喵喵
  喵喵喵
  喵喵喵喵喵喵喵喵喵
  喵喵喵`,
});

const useFakeApiGetCertificate = (id: string | undefined) => {
  const [data, setData] = useState<Tdata>();

  const update = async () => {
    if (!id) {
      return;
    }

    setData(createFakeData);
  };

  return { data, update };
};
