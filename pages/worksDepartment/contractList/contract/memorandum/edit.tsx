import {
  //
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useRef,
  useImperativeHandle,
  Fragment,
  useCallback,
  memo,
} from 'react';
import { useRouter, NextRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import { useInView } from 'react-intersection-observer';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { AxiosError } from 'axios';

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
import {
  //
  TmemorandumDto,
  TfileDto,
  TcreateMemorandumDto,
  useGetMemorandum_id,
  useGetMemorandumAttachments,
  apiPostMemorandum,
  apiPostMemorandumAttachments,
  apiPostMemorandumEmail,
} from 'js/api/api_memorandum';

//  type
import { TcustomerDto } from 'js/api/dtoTypes';

// utils
import { getBase64 } from 'js/utils/helpers/getBase64';

// ====================================================================

type Tquery = {
  contractId: string | undefined;
  memorandumId: string | undefined;
  memotype: string | undefined;
};

type TmemorandumDto_whole = TmemorandumDto<{
  poster: true;
  recipient: true;
}>;

type TstateMemorandum = Pick<
  TmemorandumDto_whole,
  | 'poster'
  | 'recipient'
  | 'postDate'
  | 'issueNumber'
  | 'purpose'
  | 'description'
  //
  | 'posterEmail'
  | 'recipientEmail'
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
  const { contractId, memorandumId: rootMemorandumId, memotype } = router.query as Tquery;
  const isNew = !rootMemorandumId;

  // ---------------------------------------------------------------------------

  // 用來在新增備忘錄後，滾動到最上面
  const ref_anchor = useRef<HTMLDivElement>(null!);

  const ref_replyMemorandum = useRef<TreplyMemorandumHandler>(null!);

  // ---------------------------------------------------------------------------

  const [isReply, setIsReply] = useState(isNew);

  // ---------------------------------------------------------------------------
  const [isFectching, setIsFectching] = useState(false);

  const [fetchControl, setFetchControl] = useState<TfetchControlItem[]>();

  // ---------------------------------------------------------------------------
  // 合約
  const {
    //
    data: contract,
    update: update_contract,
    isFetching: isFetching_contract,
  } = useGetContract_id(contractId, {
    customPopulate: ['engineeringContact'],
  });

  const { engineeringContact } = contract ?? {};

  const {
    data: data_rootMemorandum,
    update: update_rootMemorandum,
    isFetching: isFetching_rootMemorandum,
  } = useGetMemorandum_id(rootMemorandumId);

  // ---------------------------------------------------------------------------

  // ██████  ███████  ██████  ███████ ███████ ████████
  // ██   ██ ██      ██    ██ ██      ██         ██
  // ██████  █████   ██    ██ █████   ███████    ██
  // ██   ██ ██      ██ ▄▄ ██ ██           ██    ██
  // ██   ██ ███████  ██████  ███████ ███████    ██
  //                     ▀▀

  const reqPostReply = async () => {
    const {
      memorandum: {
        //
        poster,
        recipient,
        // postDate,
        issueNumber,
        purpose,
        description,
        posterEmail,
        recipientEmail,
      },
      attachmentArr,
    } = ref_replyMemorandum.current.getData();

    if (!contractId) {
      return;
    }

    if (!poster || !recipient) {
      myAlert.warning({ title: '必須選擇發文者與受文者' });

      return;
    }

    if (!posterEmail || !recipientEmail) {
      myAlert.warning({ title: '必須填寫發文者與受文者的Email' });

      return;
    }

    const body: TcreateMemorandumDto = {
      posterId: poster.id,
      posterEmail,
      recipientId: recipient.id,
      recipientEmail,
      issueNumber,
      purpose,
      description,
      rootMailId: rootMemorandumId ?? null,
    };

    setIsFectching(true);
    await apiPostMemorandum(contractId, body)
      //
      .then(async (res) => {
        const newMemorandumId = res.id;

        for (const file of attachmentArr) {
          const formData = new FormData();
          formData.append('file', file);

          let shouldBreak = false;
          await apiPostMemorandumAttachments(newMemorandumId, formData).catch((error) => {
            const err = error as AxiosError;
            myAlert.err({ title: '新增附件失敗，新增流程中止', content: err.message });
            shouldBreak = true;
          });

          if (shouldBreak) {
            break;
          }
        }

        return newMemorandumId;
      })
      .then(async (newMemorandumId) => {
        await apiPostMemorandumEmail(newMemorandumId);

        return newMemorandumId;
      })
      .then((newMemorandumId) => {
        if (!rootMemorandumId) {
          router.push({
            query: {
              ...router.query,
              memorandumId: newMemorandumId,
            },
          });
        } else {
          update_rootMemorandum();
          setFetchControl((state) => [
            ...(state ?? []),
            {
              id: newMemorandumId,
              status: 'allow',
            },
          ]);
        }
      })
      .then(() => {
        setIsReply(false);
        ref_anchor.current.scrollIntoView({ behavior: 'smooth' });
      })
      .finally(() => {
        setIsFectching(false);
      });
  };
  // ---------------------------------------------------------------------------

  const data_memorandumIdArr = useMemo(() => {
    const arr = [...(data_rootMemorandum?.mailThread ?? [])];
    data_rootMemorandum && arr.unshift(data_rootMemorandum.id);

    return arr;
  }, [data_rootMemorandum]);

  // ---------------------------------------------------------------------------

  useEffect(() => {
    update_contract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  useEffect(() => {
    update_rootMemorandum();
  }, [rootMemorandumId]);

  useEffect(() => {
    if (isReply || fetchControl || data_memorandumIdArr.length === 0) {
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
    isReply: isReply,
    setIsReply: setIsReply,
    isNew,
    reqPostReply,
    turnBack: () => {
      router.push({
        pathname: '/worksDepartment/contractList/contract/memorandum',
        query: {
          contractId,
          memotype,
        },
      });
    },
  });

  // ---------------------------------------------------------------------------

  // ██████  ███████ ███    ██ ██████  ███████ ██████
  // ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  // ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  // ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  // ██   ██ ███████ ██   ████ ██████  ███████ ██   ██

  return (
    <SubLayer isLoading_all={isFectching} isLoading_subLayer={isFetching_contract || isFetching_rootMemorandum}>
      <PageHeader panelList={panelList} contractNumber={engineeringContact?.contractNumber ?? ''} />
      {/* pt-[1px]是為了處理 margin collapse */}
      <div className={'pt-[1px]'}>
        <div ref={ref_anchor} />
        <Wrapper>
          <div className={classNames(isReply && 'hidden')}>
            {data_memorandumIdArr?.map((id, index) => {
              const isAllow = fetchControl?.[index]?.status === 'allow';

              return (
                <Fragment key={id}>
                  <OneMemorandum_memo
                    memorandumId={id}
                    allowFetch={isAllow}
                    onFetchOver={({ isSuccess }) => {
                      setFetchControl((state) => {
                        const arr = [...(state ?? [])];
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
          </div>

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
  posterEmail_value,
  // posterEmail_onChange,
  recipientEmail_value,
  recipientEmail_onChange,
}: {
  //
  disabled?: boolean;

  recipient_value: string;
  recipient_onClick?: (() => void) | undefined;

  replyDate_value: Moment | null;

  poster_value: string;
  poster_onClick?: (() => void) | undefined;

  issueNumber_value: string;

  purpose_value: string;
  purpose_onChange?: (value: string) => void;

  posterEmail_value?: string;
  // posterEmail_onChange?: (value: string) => void;

  recipientEmail_value?: string;
  recipientEmail_onChange?: (value: string) => void;
}) => {
  return (
    <>
      <InputSel
        {...inputSelProps}
        {...config_inputSel}
        caption="受文者"
        showBaseline="auto"
        disabled={disabled}
        onClick={recipient_onClick}
        //
        inputProps={{
          props: {
            value: recipient_value,
            placeholder: '請選擇受文者',
            readOnly: true,
            onChange: () => {},
          },
        }}
      />
      <InputSel
        {...inputSelProps}
        {...config_inputSel}
        caption="受文者Email"
        showBaseline="auto"
        disabled={disabled}
        //
        inputProps={{
          props: {
            value: recipientEmail_value,
            onChange: (e) => {
              recipientEmail_onChange && recipientEmail_onChange(e.target.value);
            },
          },
        }}
      />

      <InputSel
        {...inputSelProps}
        {...config_inputSel}
        caption="發文者"
        showBaseline="auto"
        disabled={disabled}
        onClick={poster_onClick}
        //
        inputProps={{
          props: {
            value: poster_value,
            placeholder: '請選擇發文者',
            readOnly: true,
            onChange: () => {},
          },
        }}
      />
      <InputSel
        {...inputSelProps}
        {...config_inputSel}
        caption="發文者Email"
        showBaseline="auto"
        disabled={true}
        //
        inputProps={{
          props: {
            value: posterEmail_value,
            onChange: (e) => {
              // posterEmail_onChange && posterEmail_onChange(e.target.value);
            },
          },
        }}
      />

      <InputSel
        {...inputSelProps}
        {...config_inputSel}
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
        {...config_inputSel}
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
        {...config_inputSel}
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

  const { data: data_memorandum, update: update_memorandum } = useGetMemorandum_id(memorandumId);
  const { data: data_attachmentArr, update: update_attachment } = useGetMemorandumAttachments(memorandumId);

  const {
    //
    // id,
    // createdAt,
    // updatedAt,
    // posterId,
    poster,
    postDate,
    // recipientId,
    recipient,
    recipientDate,
    // replyDate,
    issueNumber,
    purpose,
    description,
    // isPoster,
    posterEmail,
    recipientEmail,
  } = data_memorandum ?? {};

  const memorandumDate = postDate || recipientDate;

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
              replyDate_value={memorandumDate ? moment(memorandumDate) : null}
              poster_value={poster?.name ?? ''}
              issueNumber_value={issueNumber ?? ''}
              purpose_value={purpose ?? ''}
              posterEmail_value={posterEmail ?? ''}
              recipientEmail_value={recipientEmail ?? ''}
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

const OneMemorandum_memo = memo(OneMemorandum, (pre, next) => {
  return pre.memorandumId === next.memorandumId && pre.allowFetch === next.allowFetch;
});

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
  const emptyForm: TstateMemorandum = {
    recipient: undefined, // 受文者
    poster: undefined, // 發文者
    issueNumber: '', // 發文字號
    purpose: '', // 主旨
    description: '', // 備註
    postDate: new Date().toISOString(), // 日期
    posterEmail: process.env.NEXT_PUBLIC_SANJEOU_EMAIL ?? 'sanjeouit@gmail.com',
    recipientEmail: '',
  };

  console.log('in-NEXT_PUBLIC_SANJEOU_EMAIL', process.env.NEXT_PUBLIC_SANJEOU_EMAIL);

  // -----------------------------------------------------------------------
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

  const editStateMemorandum = (key: 'purpose' | 'description' | 'recipientEmail' | 'posterEmail', value: string) => {
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
          replyDate_value={moment(state_memorandum.postDate)}
          poster_value={state_memorandum.poster?.name ?? ''}
          poster_onClick={() => setSelectorAction('sender')}
          issueNumber_value={state_memorandum.issueNumber ?? ''}
          purpose_value={state_memorandum.purpose ?? ''}
          purpose_onChange={(value) => editStateMemorandum('purpose', value)}
          posterEmail_value={state_memorandum.posterEmail ?? ''}
          // posterEmail_onChange={(value) => editStateMemorandum('posterEmail', value)}
          recipientEmail_value={state_memorandum.recipientEmail ?? ''}
          recipientEmail_onChange={(value) => editStateMemorandum('recipientEmail', value)}
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
  isReply,
  setIsReply,
  isNew,
  reqPostReply,
  turnBack,
}: {
  isReply: boolean;
  setIsReply: React.Dispatch<React.SetStateAction<boolean>>;
  isNew: boolean;
  reqPostReply: () => void;
  turnBack: () => void;
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
      onClick: turnBack,
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
      onClick: turnBack,
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

// ===========================================================================

//  ██████  ██████  ███    ██ ███████ ██  ██████
// ██      ██    ██ ████   ██ ██      ██ ██
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██
//  ██████  ██████  ██   ████ ██      ██  ██████

// const emptyForm: TstateMemorandum = {
//   recipient: undefined, // 受文者
//   poster: undefined, // 發文者
//   issueNumber: '', // 發文字號
//   purpose: '', // 主旨
//   description: '', // 備註
//   postDate: new Date().toISOString(), // 日期
//   posterEmail: process.env.NEXT_PUBLIC_SANJEOU_EMAIL ?? 'sanjeouit@gmail.com',
//   recipientEmail: '',
// };
console.log('out-NEXT_PUBLIC_SANJEOU_EMAIL', process.env.NEXT_PUBLIC_SANJEOU_EMAIL);

const config_inputSel = {
  captionStyle: { width: '110px' },
};
