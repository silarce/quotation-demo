import { useState, useEffect, useMemo, forwardRef, useRef, useImperativeHandle, Fragment } from 'react';
import { useRouter, NextRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import { useInView } from 'react-intersection-observer';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Image } from 'antd';

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

type TfetchControlItem = {
  id: string;
  status: 'allow' | 'notAllow' | 'done' | 'error';
};

type TreplyMemorandumHandler = {
  getData: () => {
    memorandum: TstateMemorandum;
    attachmentArr: File[];
  };
};

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

  const ref_replyMemorandum = useRef<TreplyMemorandumHandler>(null!);

  // ---------------------------------------------------------------------------

  const [isReply, setIsReply] = useState(isNew);

  // ---------------------------------------------------------------------------

  const [fetchControl, setFetchControl] = useState<TfetchControlItem[]>([]);

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

  const { data: data_memorandumIdArr, update: update_memorandumIdArr } = useGetmemorandumId_fake();

  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  const reqPostReply = () => {
    const replyMemorandumData = ref_replyMemorandum.current.getData();
  };
  // ---------------------------------------------------------------------------

  useEffect(() => {
    update_contract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  useEffect(() => {
    update_memorandumIdArr();
  }, []);

  useEffect(() => {
    if (isReply) {
      return;
    }

    const arr: TfetchControlItem[] = (data_memorandumIdArr ?? []).map((id) => ({
      id,
      status: 'notAllow',
    }));

    arr[0] && (arr[0].status = 'allow');
    setFetchControl(arr);
  }, [data_memorandumIdArr, isReply]);

  // ---------------------------------------------------------------------------

  const panelList = panelListSwitcher({
    router,
    isReply: isReply,
    setIsReply: setIsReply,
    isNew,
    reqPostReply,
  });

  // ---------------------------------------------------------------------------

  // ██████  ███████ ███    ██ ██████  ███████ ██████
  // ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  // ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  // ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  // ██   ██ ███████ ██   ████ ██████  ███████ ██   ██

  return (
    <SubLayer>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />

      <div>
        <Wrapper>
          {!isReply &&
            data_memorandumIdArr?.map((id, index) => {
              const isAllow = fetchControl?.[index]?.status === 'allow';

              return (
                <Fragment key={id}>
                  <OneMemorandum
                    memorandumId={id}
                    allowFetch={isAllow}
                    onFetchOver={({ isSuccess }) => {
                      setFetchControl((state) => {
                        const arr = [...state];
                        arr[index].status = isSuccess ? 'done' : 'error';
                        arr[index + 1] && (arr[index + 1].status = 'allow');

                        return arr;
                      });
                    }}
                  />
                  <hr className={'border-border mb-10'} />
                </Fragment>
              );
            })}

          {isReply && <ReplyMemorandum ref={ref_replyMemorandum} />}

          {/*  */}
        </Wrapper>
      </div>
    </SubLayer>
  );
}

// ███████ ███    ██ ██████
// ██      ████   ██ ██   ██
// █████   ██ ██  ██ ██   ██
// ██      ██  ██ ██ ██   ██
// ███████ ██   ████ ██████

// ==============================================================================

//  ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
// ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
// ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
// ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
//  ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██

const Info = ({
  disabled,
  recipient_value,
  recipient_onClick,
  replyDate_value,
  poster_value,
  poster_onClick,
  issueNumber_value,
  purpose_value,
  purpose_onChange,
}: {
  //
  disabled?: boolean;

  recipient_value: string;
  recipient_onClick?: (() => void) | undefined;

  replyDate_value: Moment;

  poster_value: string;
  poster_onClick?: (() => void) | undefined;

  issueNumber_value: string;

  purpose_value: string;
  purpose_onChange?: (value: string) => void;
}) => {
  return (
    <>
      <InputSel
        {...inputSelProps}
        caption="受文者"
        showBaseline="auto"
        disabled={disabled}
        onClick={recipient_onClick}
        //
        inputProps={{
          props: {
            value: recipient_value,
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
            value: replyDate_value,
          },
        }}
      />
      <InputSel
        {...inputSelProps}
        caption="發文者"
        showBaseline="auto"
        disabled={disabled}
        onClick={poster_onClick}
        //
        inputProps={{
          props: {
            value: poster_value,
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
            value: issueNumber_value,
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
            value: purpose_value,
            placeholder: '請輸入主旨',
            onChange: (e) => {
              purpose_onChange?.(e.target.value);
            },
          },
        }}
        className="col-span-2"
      />
    </>
  );
};

const OneMemorandum = ({
  memorandumId,
  allowFetch,
  onFetchOver,
}: {
  memorandumId: string;
  allowFetch: boolean;
  onFetchOver: (parameter: { isSuccess: boolean }) => void;
}) => {
  const [viewRef, isView] = useInView();

  const { data: data_memorandum, update: update_memorandum } = useGetMemorandum_fake({ id: memorandumId });
  const { data: data_attachmentArr, update: update_attachment } = useGetMemorandumAttachment_fake({ id: memorandumId });

  const {
    //
    // id,
    // createdAt,
    // updatedAt,
    // posterId,
    poster,
    // recipientId,
    recipient,
    replyDate,
    issueNumber,
    purpose,
    description,
    // isPoster,
  } = data_memorandum ?? {};

  const { attachmentArr_image, attachmentArr_other } = useSortAttachment({ data_attachmentArr });
  const [status, setStatus] = useState<'notReady' | 'done' | 'error'>('notReady');
  // -------------------------------------------------------------------------------

  const init = async () => {
    await Promise.all([update_memorandum(), update_attachment()])
      .then(() => {
        onFetchOver({ isSuccess: true });
        setStatus('done');
      })
      .catch(() => {
        onFetchOver({ isSuccess: false });
        setStatus('error');
      });
  };
  // -------------------------------------------------------------------------------

  useEffect(() => {
    // if (data_memorandum && data_attachmentArr) {
    //   return;
    // }

    if (isView && allowFetch && status === 'notReady') {
      init();
    }
  }, [memorandumId, isView, allowFetch, status]);

  if (status == 'error') {
    return (
      <div ref={viewRef}>
        <h1 className="text-6xl text-danger">{memorandumId}-ERROR</h1>
      </div>
    );
  }

  // -------------------------------------------------------------------------------

  return (
    <div ref={viewRef}>
      {status === 'done' && (
        <>
          <Wrapper_inpuSel_01>
            <Info
              disabled={true}
              recipient_value={recipient?.name ?? ''}
              replyDate_value={moment(replyDate)}
              poster_value={poster?.name ?? ''}
              issueNumber_value={issueNumber ?? ''}
              purpose_value={purpose ?? ''}
            />
          </Wrapper_inpuSel_01>
          {/* 備註 */}
          <WrappedTextarea
            disabled={true}
            textareaProps={{
              props: {
                value: description,
                placeholder: '建立備忘錄錄新增',
              },
            }}
          />
          {/* 附件 */}
          <div className={scss.attachmentContainer}>
            <div className={scss.caption}>
              <span>附件</span>
            </div>

            <div className={classNames(scss.imgList, 'col-start-2')}>
              {attachmentArr_other.map((attachment_other) => {
                const { id, name } = attachment_other;

                return (
                  <div key={id}>
                    <label>
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${id}`}
                        // 似乎可以請後端改request header的Content-Disposition
                        // 使這個超連結能直接開啟檔案(PDF有效)，而非下載
                        // target="_blank"
                        // rel="noreferrer"
                      >
                        {name}
                      </a>
                    </label>
                  </div>
                );
              })}

              {attachmentArr_image?.map((attachment_image) => {
                return (
                  <div key={attachment_image.id} className="relative w-fit max-w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${attachment_image.id}`}
                      alt={attachment_image.id}
                      className="max-w-full max-h-[600px]"
                    />
                  </div>
                );
              })}
            </div>
            {/*  */}
            <div />
          </div>
        </>
      )}
    </div>
  );
};

// ================================================================
// ================================================================
// ================================================================

// 要使用ref就一定先設props
const ReplyMemorandum_pre = (
  {
    className,
  }: {
    className?: string;
  },
  ref: React.ForwardedRef<unknown>
) => {
  // 點擊受文者或發文者時切換，然後會打開選擇器
  const [selectorAction, setSelectorAction] = useState<'reciver' | 'sender'>();

  const [state_memorandum, setState_memorandum] = useState<TstateMemorandum>(emptyForm);
  const [state_fileArr, setState_fileArr] = useState<File[]>([]);

  const [state_dealedFile, setState_dealedFile] = useState<{
    img: {
      fileIndex: number;
      key: string;
      base64: string;
    }[];
    other: {
      fileIndex: number;
      key: string;
      name: string;
      src: string;
    }[];
  }>({
    img: [],
    other: [],
  });

  // ------------------------------------------------------------------------

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

  const deleteFile = (index: number) => {
    setState_fileArr((state) => {
      const arr = [...state];
      arr.splice(index, 1);

      return arr;
    });
  };

  // ------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      const arr_img = [];
      const arr_other = [];

      let index = 0;

      for (const file of state_fileArr) {
        const { name, type, size } = file;
        const key = name + String(size) + type;

        if (type.includes('image')) {
          const base64 = await getBase64(file);

          arr_img.push({
            fileIndex: index++,
            key,
            base64,
          });
        } else {
          arr_other.push({
            fileIndex: index++,
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
  // ------------------------------------------------------------------------

  // state_memorandum
  // state_fileArr

  useImperativeHandle(
    ref,
    (): TreplyMemorandumHandler => ({
      getData: () => {
        return {
          memorandum: state_memorandum,
          attachmentArr: state_fileArr,
        };
      },
    })
  );
  // ------------------------------------------------------------------------

  return (
    <div className={classNames(className)}>
      <Wrapper_inpuSel_01>
        <Info
          recipient_value={state_memorandum.recipient?.name ?? ''}
          recipient_onClick={() => setSelectorAction('reciver')}
          replyDate_value={moment(state_memorandum.replyDate)}
          poster_value={state_memorandum.poster?.name ?? ''}
          poster_onClick={() => setSelectorAction('sender')}
          issueNumber_value={state_memorandum.issueNumber ?? ''}
          purpose_value={state_memorandum.purpose ?? ''}
          purpose_onChange={(value) => editStateMemorandum('purpose', value)}
        />
      </Wrapper_inpuSel_01>

      <WrappedTextarea
        textareaProps={{
          props: {
            value: state_memorandum.description,
            onChange: (e) => editStateMemorandum('description', e.target.value),
            placeholder: '建立備忘錄錄新增',
          },
        }}
      />

      {/* 附件 */}
      <div className={scss.attachmentContainer}>
        <div className={scss.caption}>
          <span>附件</span>
        </div>

        <div className={classNames(scss.uploadPanel)}>
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
          {/* state_dealedFile */}
          {state_dealedFile.other.map((other) => {
            const { fileIndex, key, name, src } = other;

            return (
              <div key={key} className="relative w-fit max-w-full">
                <label>
                  <a href={src} target="_blank" rel="noreferrer">
                    {name}
                  </a>
                </label>
                <IconRemove02 className="global_absoluteRightTopRight" onClick={() => deleteFile(fileIndex)} />
              </div>
            );
          })}

          {state_dealedFile.img?.map((file) => {
            const { fileIndex, key, base64 } = file;

            return (
              <div key={key} className="relative w-fit max-w-full">
                <Image src={base64} alt={key} className="max-w-full max-h-[600px]" />

                <IconRemove02 className="global_absoluteRightTop" onClick={() => deleteFile(fileIndex)} />
              </div>
            );
          })}
        </div>
        {/*  */}
        <div />
      </div>
      <Selector_customer
        showModal={!!selectorAction}
        onConfirm={(arr) => {
          const customer = arr[0][0];
          onSelectorConfirm(customer);
        }}
        onCancel={() => setSelectorAction(undefined)}
      />
    </div>
  );
};

const ReplyMemorandum = forwardRef(ReplyMemorandum_pre);

// ==============================================================================

// ██████  ███████ ██████  ██    ██  ██████ ███████ ██████
// ██   ██ ██      ██   ██ ██    ██ ██      ██      ██   ██
// ██████  █████   ██   ██ ██    ██ ██      █████   ██████
// ██   ██ ██      ██   ██ ██    ██ ██      ██      ██   ██
// ██   ██ ███████ ██████   ██████   ██████ ███████ ██   ██

const panelListSwitcher = ({
  router,
  isReply,
  setIsReply,
  isNew,
  reqPostReply,
}: {
  router: NextRouter;
  isReply: boolean;
  setIsReply: React.Dispatch<React.SetStateAction<boolean>>;
  isNew: boolean;
  reqPostReply: () => void;
}) => {
  const panelList_new: TpanelList = [
    {
      type: 'redButton',
      label: '發文',
      onClick: reqPostReply,
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
        setIsReply(true);
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
      onClick: reqPostReply,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setIsReply(false);
      },
    },
  ];

  let panelList: TpanelList = [];

  if (isNew) {
    panelList = panelList_new;
  } else {
    panelList = isReply ? panelList02_abled : panelList_disabled;
    // panelList = panelList_disabled;
  }

  return panelList;
};

// ===========================================================================

// ██   ██  ██████   ██████  ██   ██
// ██   ██ ██    ██ ██    ██ ██  ██
// ███████ ██    ██ ██    ██ █████
// ██   ██ ██    ██ ██    ██ ██  ██
// ██   ██  ██████   ██████  ██   ██

const useSortAttachment = ({ data_attachmentArr }: { data_attachmentArr: TfileDto[] | undefined }) => {
  const { arr_image, arr_other } = useMemo(() => {
    const arr_image: TfileDto[] = [];
    const arr_other: TfileDto[] = [];

    data_attachmentArr?.forEach((attachment) => {
      if (attachment.mime.includes('image')) {
        arr_image.push(attachment);
      } else {
        arr_other.push(attachment);
      }
    });

    // return [arr_image, arr_other];
    return {
      arr_image,
      arr_other,
    };
  }, [data_attachmentArr]);

  return { attachmentArr_image: arr_image, attachmentArr_other: arr_other };
};

// const useMemorandumInfinite = ({
//   //
//   memorandumIdArr,
// }: {
//   memorandumIdArr: string[] | undefined;
// }) => {
//   const count = memorandumIdArr?.length ?? 0;

//   const [viewRef, isView] = useInView();
//   const [isFetching, setIsFetching] = useState(false);
//   const [index, setIndex] = useState<number>(-1);

//   const isLast = index === count - 1;

//   const [memorandumArr, setMemorandumArr] = useState<
//     ({
//       memorandum: TmemorandumDto_whole;
//       attachment: TfileDto[];
//     } | null)[]
//   >([]);

//   const updateByIndex = async () => {
//     const id = memorandumIdArr?.[index];

//     if (!id) {
//       return;
//     }

//     setIsFetching(true);
//     await Promise.all([fakeApi_getMemorandum(id), fakeApi_getMemorandumAttachment(id)])
//       .then(([fakeM, fakeA]) => {
//         if (fakeM) {
//           setMemorandumArr((state) => {
//             const arr = [...state];
//             arr.push({ memorandum: fakeM, attachment: fakeA ?? [] });

//             return arr;
//           });
//         } else {
//           setMemorandumArr((state) => {
//             const arr = [...state];
//             arr.push(null);

//             return arr;
//           });
//         }
//       })
//       .finally(() => {
//         setIsFetching(false);
//       });
//   };

//   const reset = () => {
//     setMemorandumArr([]);
//     setIndex(0);
//     setIsFetching(false);
//   };
//   // ----------------------------------------------------------

//   useEffect(() => {
//     if (isLast || isFetching) {
//       return;
//     }

//     if (isView) {
//       setIndex((state) => state + 1);
//     }
//   }, [isView, isFetching]);

//   useEffect(() => {
//     updateByIndex();
//   }, [index]);

//   // ----------------------------------------------------------
//   return {
//     viewRef,
//     isFetching,
//     memorandumArr,
//     reset,
//   };

//   //
// }; // useMemorandumInfinite

// ===========================================================================

// ███████  █████  ██   ██ ███████     ██████   █████  ████████  █████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// █████   ███████ █████   █████       ██   ██ ███████    ██    ███████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// ██      ██   ██ ██   ██ ███████     ██████  ██   ██    ██    ██   ██

const emptyForm: TstateMemorandum = {
  recipient: undefined, // 受文者
  poster: undefined, // 發文者
  issueNumber: '', // 發文字號
  purpose: '', // 主旨
  description: '', // 備註
  replyDate: new Date().toISOString(), // 回覆日期
};

const fakeData: TmemorandumDto_whole = {
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

// const fake_memorandumIdArr = ['fakeId_001', 'fakeId_002', 'fakeId_003'];
const fake_memorandumIdArr = ['fakeId_001'];

const useGetmemorandumId_fake = () => {
  const [res, setRes] = useState<string[]>();

  const update = async () => {
    setRes(fake_memorandumIdArr);
  };

  return {
    data: res,
    update,
  };
};

const useGetMemorandum_fake = ({ id }: { id: string | null | undefined }) => {
  const [res, setRes] = useState<TmemorandumDto_whole>();

  const update = async () => {
    if (!id) {
      return;
    }

    fakeApi_getMemorandum(id).then((fakeData) => {
      fakeData && setRes(fakeData);
    });
  };

  return {
    data: res,
    update,
  };
};

const useGetMemorandumAttachment_fake = ({ id }: { id: string | null | undefined }) => {
  const [res, setRes] = useState<TfileDto[]>();

  const update = async () => {
    if (!id) {
      return;
    }

    fakeApi_getMemorandumAttachment(id).then((fakeAttachment) => {
      fakeAttachment && setRes(fakeAttachment);
    });
  };

  return {
    data: res,
    update,
  };
};

const fakeApi_getMemorandum = async (id: string): Promise<TmemorandumDto_whole | null> => {
  return fakeData;
};

const fakeApi_getMemorandumAttachment = async (id: string): Promise<TfileDto[] | null> => {
  return [fakeAttachment01, fakeAttachment02, fakeAttachment03];
};
