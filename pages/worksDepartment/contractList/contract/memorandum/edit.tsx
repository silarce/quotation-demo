import { useState, useEffect, useMemo } from 'react';
import { useRouter, NextRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Image, Upload } from 'antd';

// ui
import {
  Wrapper,
  Wrapper_inpuSel_01,
  inputSelProps,
  WrappedTextarea,
} from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './edit.module.scss';

// api
import { useGetContract_id } from 'js/api/api_quotation';

//  type
import { TmemorandumDto, TcustomerDto, TfileDto } from 'js/api/dtoTypes';

// utils
import { getBase64 } from 'js/utils/helpers/getBase64';

// ====================================================================

type Tquery = {
  contractId: string | undefined;
  memorandumId: string | undefined;
};

type TmemorandumDto_whole = TmemorandumDto<{
  poster: true;
  recipient: true;
}>;

type TstateMemorandum = Pick<
  TmemorandumDto_whole,
  'poster' | 'recipient' | 'replyDate' | 'issueNumber' | 'purpose' | 'description'
>;

// ====================================================================

const Selector_customer = selectModalCreator_multi<['customer']>({
  selectorArr: [
    {
      key: 'customer',
      tip: '請選擇客戶',
      limit: 1,
    },
  ],
});

// ====================================================================

// ███████ ████████  █████  ██████  ████████
// ██         ██    ██   ██ ██   ██    ██
// ███████    ██    ███████ ██████     ██
//      ██    ██    ██   ██ ██   ██    ██
// ███████    ██    ██   ██ ██   ██    ██

export default function Edit() {
  const router = useRouter();
  const { contractId, memorandumId } = router.query as Tquery;
  const isNew = !memorandumId;

  // ---------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(!isNew);

  // 點擊受文者或發文者時切換，然後會打開選擇器
  const [selectorAction, setSelectorAction] = useState<'reciver' | 'sender'>();

  // ---------------------------------------------------------------------------

  const [state_memorandum, setState_memorandum] = useState<TstateMemorandum>(emptyForm);
  const [state_fileArr, setState_fileArr] = useState<File[]>([]);

  const [state_dealedFile, setState_dealedFile] = useState<{
    img: {
      key: string;
      base64: string;
    }[];
    other: {
      key: string;
      name: string;
      src: string;
    }[];
  }>({
    img: [],
    other: [],
  });

  // ---------------------------------------------------------------------------
  // 合約
  const {
    //
    data: contract,
    update: update_contract,
  } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact'],
  });

  const { engineeringContact } = contract ?? {};

  const { data: data_memorandum, update: update_memorandum } = useGetMemorandum_fake({ id: memorandumId });
  const { data: data_attachmentArr, update: update_attachment } = useGetMemorandumAttachment_fake({ id: memorandumId });

  // ---------------------------------------------------------------------------

  const editStateMemorandum = (key: 'purpose' | 'description', value: string) => {
    setState_memorandum({ ...state_memorandum, [key]: value });
  };

  // 選擇器onConfirm
  const onSelectorConfirm = (customer: TcustomerDto) => {
    if (selectorAction === 'reciver') {
      setState_memorandum({
        ...state_memorandum,
        recipient: customer,
      });
    } else if (selectorAction === 'sender') {
      setState_memorandum({
        ...state_memorandum,
        poster: customer,
      });
    }
  };

  const init_mrmorandum = async () => {
    Promise.all([update_memorandum(), update_attachment()]);
  };

  // ---------------------------------------------------------------------------

  const [data_attachmentArr_img, data_attachmentArr_other] = useMemo(() => {
    const arr_image: TfileDto[] = [];
    const arr_other: TfileDto[] = [];

    data_attachmentArr?.forEach((attachment) => {
      if (attachment.mime.includes('image')) {
        arr_image.push(attachment);
      } else {
        arr_other.push(attachment);
      }
    });

    return [arr_image, arr_other];
  }, [data_attachmentArr]);

  // ---------------------------------------------------------------------------

  useEffect(() => {
    update_contract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  useEffect(() => {
    init_mrmorandum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memorandumId]);

  useEffect(() => {
    if (!disabled) {
      setState_memorandum(emptyForm);
    } else {
      const state = {
        recipient: data_memorandum?.recipient,
        poster: data_memorandum?.poster,
        issueNumber: data_memorandum?.issueNumber ?? '',
        purpose: data_memorandum?.purpose ?? '',
        description: data_memorandum?.description ?? '',
        replyDate: data_memorandum?.replyDate,
      };

      setState_memorandum(state);
    }
  }, [disabled, data_memorandum]);

  useEffect(() => {
    if (disabled) {
      setState_fileArr([]);

      setState_dealedFile({
        img: [],
        other: [],
      });
    }
  }, [disabled]);

  useEffect(() => {
    (async () => {
      const arr_img = [];
      const arr_other = [];

      for (const file of state_fileArr) {
        const { name, type, size } = file;
        const key = name + String(size) + type;

        if (type.includes('image')) {
          const base64 = await getBase64(file);

          arr_img.push({
            key,
            base64,
          });
        } else {
          arr_other.push({
            key,
            name: file.name,
            src: URL.createObjectURL(file),
          });
        }
      }

      setState_dealedFile({
        img: arr_img,
        other: arr_other,
      });
    })();
  }, [state_fileArr]);

  // ---------------------------------------------------------------------------

  const panelList = panelListSwitcher({
    router,
    disabled,
    setDisabled,
    isNew,
  });

  // ---------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <div>
        <Wrapper>
          <Wrapper_inpuSel_01>
            <InputSel
              {...inputSelProps}
              caption="受文者"
              showBaseline="auto"
              disabled={disabled}
              onClick={() => setSelectorAction('reciver')}
              //
              inputProps={{
                props: {
                  value: state_memorandum?.recipient?.name ?? '',
                  placeholder: '請選擇受文者',
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="日期"
              showBaseline="auto"
              disabled={true}
              //
              datePickerProps={{
                props: {
                  value: moment(state_memorandum.replyDate),
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="發文者"
              showBaseline="auto"
              disabled={disabled}
              onClick={() => setSelectorAction('sender')}
              //
              inputProps={{
                props: {
                  value: state_memorandum?.poster?.name ?? '',
                  placeholder: '請選擇發文者',
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="發文字號"
              showBaseline="auto"
              disabled={true}
              inputProps={{
                props: {
                  value: state_memorandum.issueNumber,
                  placeholder: '建立備忘錄錄新增',
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="主旨"
              showBaseline="auto"
              disabled={disabled}
              //
              inputProps={{
                props: {
                  value: state_memorandum.purpose,
                  placeholder: '請輸入主旨',
                  onChange: (e) => {
                    editStateMemorandum('purpose', e.target.value);
                  },
                },
              }}
              className="col-span-2"
            />
          </Wrapper_inpuSel_01>
          {/* 備註 */}
          <WrappedTextarea
            disabled={disabled}
            textareaProps={{
              props: {
                value: state_memorandum.description,
                placeholder: '建立備忘錄錄新增',
                onChange: (e) => {
                  editStateMemorandum('description', e.target.value);
                },
              },
            }}
          />
          {/* 附件 */}
          <div className={scss.attachmentContainer}>
            <div className={scss.caption}>
              <span>附件</span>
            </div>

            <div className={classNames(scss.uploadPanel, disabled && 'hidden')}>
              <MyButton_v2
                className={classNames(scss.btn_attachment, scss.plus)}
                // isLoading={isUploading_any}
              >
                <label htmlFor="memorandum_uploadFile">選擇附件</label>
              </MyButton_v2>
              <input
                id="memorandum_uploadFile"
                type="file"
                className={'hidden'}
                onChange={(e) => {
                  const arr = Array.from(e.target.files ?? []);

                  setState_fileArr((state) => [...state, ...arr]);
                }}
                multiple={true}
              />
            </div>

            {/* data_attachmentArr */}
            <div className={classNames(scss.imgList, 'col-start-2')}>
              {data_attachmentArr_other.map((attachment_other) => {
                if (!disabled) {
                  return null;
                }

                const { id, name } = attachment_other;

                return (
                  <div key={id}>
                    <label>
                      <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${id}`}>{name}</a>
                    </label>
                  </div>
                );
              })}

              {data_attachmentArr_img?.map((attachment) => {
                if (!disabled) {
                  return null;
                }

                return (
                  <div key={attachment.id} className="relative w-fit max-w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${attachment.id}`}
                      alt={attachment.id}
                      className="max-w-full max-h-[600px]"
                    />
                    {isNew && <IconRemove02 className="global_absoluteRightTop" onClick={() => alert('req delete')} />}
                  </div>
                );
              })}
              {/*  */}
              {/* state_dealedFile */}
              {state_dealedFile.other.map((other) => {
                const { key, name, src } = other;

                return (
                  <div key={key} className="relative w-fit max-w-full">
                    <label>
                      <a href={src}>{name}</a>
                      {/* <input type="file" value={file} /> */}
                    </label>
                    <IconRemove02 className="global_absoluteRightTopRight" onClick={() => alert('test')} />
                  </div>
                );
              })}

              {state_dealedFile.img?.map((file) => {
                const { key, base64 } = file;

                return (
                  <div key={key} className="relative w-fit max-w-full">
                    <Image src={base64} alt={key} className="max-w-full max-h-[600px]" />
                    {isNew && <IconRemove02 className="global_absoluteRightTop" onClick={() => alert('req delete')} />}
                    <IconRemove02 className="global_absoluteRightTop" onClick={() => alert('test')} />
                  </div>
                );
              })}
            </div>
            {/*  */}
            <div />
          </div>

          {/*  */}
        </Wrapper>
      </div>

      <Selector_customer
        showModal={!!selectorAction}
        onConfirm={(arr) => {
          const customer = arr[0][0];
          onSelectorConfirm(customer);
        }}
        onCancel={() => setSelectorAction(undefined)}
      />
    </SubLayer>
  );
}

// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

const panelListSwitcher = ({
  router,
  disabled,
  setDisabled,
  isNew,
}: {
  router: NextRouter;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isNew: boolean;
}) => {
  const panelList_new: TpanelList = [
    {
      type: 'redButton',
      label: '發文',
      onClick: () => {
        alert('post API');
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
      },
    },
  ];

  const panelList_disabled: TpanelList = [
    // {
    //   type: 'redButton',
    //   label: '刪除',
    //   onClick: () => {
    //     alert('test');
    //   },
    // },
    {
      type: 'myButton',
      label: '回覆',
      onClick: () => {
        setDisabled(false);
      },
    },
    // {
    //   type: 'myButton',
    //   label: '編輯',
    //   onClick: () => {
    //     setDisabled(false);
    //   },
    // },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
      },
    },
  ];

  const panelList02_abled: TpanelList = [
    {
      type: 'redButton',
      label: '確認',
      onClick: () => {
        alert('patch API');
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  let panelList: TpanelList = [];

  if (isNew) {
    panelList = panelList_new;
  } else {
    panelList = disabled ? panelList_disabled : panelList02_abled;
    // panelList = panelList_disabled;
  }

  return panelList;
};

// ===========================================================================

const emptyForm: TstateMemorandum = {
  recipient: undefined, // 受文者
  poster: undefined, // 發文者
  issueNumber: '', // 發文字號
  purpose: '', // 主旨
  description: '', // 備註
  replyDate: new Date().toISOString(), // 回覆日期
};

const fakeData = {
  id: '003',
  createdAt: '2025-02-01T00:00:00.000Z',
  updatedAt: '2025-02-01T00:00:00.000Z',
  posterId: 'p003',
  poster: { id: 'p003', name: 'poster003' } as TcustomerDto,
  recipientId: 'recipient003',
  recipient: { id: 'r003', name: '受文者33333333' } as TcustomerDto,
  replyDate: '2025-02-01T00:00:00.000Z',
  issueNumber: 'IN-003',
  purpose: '主旨3333333',
  description: 'ccccccc',
  isPoster: false,
};

const fakeAttachment01: TfileDto = {
  id: '0c2b571b-0914-4013-83c0-c088f3a2c1e4',
  createdAt: '2024-04-22T03:55:45.520Z',
  updatedAt: '2024-04-22T03:55:45.520Z',
  parent: 'engineering-contact/3d2b1109-8463-41e7-80cd-f2a0b18ee270/construction/',
  name: 'PXL_20240117_230923815.jpg',
  size: 2713717,
  mime: 'image/jpeg',
  etag: '980ded8790adb278828173583e011890',
  isDir: false,
  isWritable: true,
  isDeletable: true,
};
const fakeAttachment02: TfileDto = {
  id: 'f98c560c-2215-43bf-8b0b-760713bb0d1e',
  createdAt: '2024-04-22T03:58:15.551Z',
  updatedAt: '2024-04-22T03:58:15.551Z',
  parent: 'engineering-contact/3d2b1109-8463-41e7-80cd-f2a0b18ee270/color/',
  name: 'cat01.jpg',
  size: 7733,
  mime: 'image/jpeg',
  etag: '61d390f31ddd0621d8bd0dcd9d675aff',
  isDir: false,
  isWritable: true,
  isDeletable: true,
};
const fakeAttachment03: TfileDto = {
  id: '66c03706-febf-4514-8d8c-24a11b7e256e',
  createdAt: '2024-04-02T06:08:36.307Z',
  updatedAt: '2024-04-02T06:08:36.307Z',
  parent: 'engineering-contact/3d2b1109-8463-41e7-80cd-f2a0b18ee270/design/',
  name: '2023南港世貿國際建材展_展覽效益檢討報告｜三久建材.pdf',
  size: 4609403,
  mime: 'application/pdf',
  etag: '9565cf5abbedabef305df7e4a8123d96',
  isDir: false,
  isWritable: true,
  isDeletable: true,
};

const useGetMemorandum_fake = ({ id }: { id: string | null | undefined }) => {
  const [res, setRes] = useState<TmemorandumDto_whole>();

  const update = async () => {
    setRes(fakeData);
  };

  return {
    data: res,
    update,
  };
};

const useGetMemorandumAttachment_fake = ({ id }: { id: string | null | undefined }) => {
  const [res, setRes] = useState<TfileDto[]>();

  const update = async () => {
    setRes([fakeAttachment01, fakeAttachment02, fakeAttachment03]);
  };

  return {
    data: res,
    update,
  };
};
