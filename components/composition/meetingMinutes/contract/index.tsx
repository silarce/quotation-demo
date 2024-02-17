import { useState, useEffect, useMemo, useContext } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';

// component
import Table01, { Ttable } from 'components/global/gear/table/table01';
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';

// ui
import {
  Wrapper,
  Wrapper_inpuSel_01,
  inputSelProps,
  WrappedTextarea,
} from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import EmployeeSelector, { TemployeeDto } from 'components/global/gear/modal/employeeSelector';
import {
  Tfile,
  TfileOriginal,
  TonFilsChange,
  //
  Upload_nameList,
} from 'components/global/gear/upload/upload_nameList/upload_nameList';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  AxiosError,
  //
  TmeetingMinutesDto,
  TcreateMeetingMinutesDto,
  //
  useGetMeetingMinutes,
  useGetMeetingMinutes_id,
  apiPostMeetingMinutes,
  apiPatchMeetingMinutes,
  //
  useGetMeetingMinutes_id_attachments,
  apiPostMeetingMinutes_id_attachments,
  apiDeleteMeetingMinutes_id_attachments,
} from 'js/api/api_meetingMinutes';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// context
import { AppContext } from 'pages/_app';

// ---------------------------------------------------------------------------

type TmeetingMinutes = TmeetingMinutesDto<{
  contract: true;
  chairmanEmployee: true;
  attendeesEmployee: true;
  minuteTakerEmployee: true;
}>;

type Tstate_meetingMinutes = Omit<
  TmeetingMinutes,
  | 'chairmanEmployeeId'
  | 'minuteTakerEmployeeId'
  | 'contractId'
  | 'contract'
  | 'chairmanEmployee'
  | 'minuteTakerEmployee'
  | 'id'
  | 'updatedAt'
> & {
  id: string | undefined;
  contract: TmeetingMinutes['contract'] | undefined;
  chairmanEmployee: TmeetingMinutes['chairmanEmployee'] | undefined;
  minuteTakerEmployee: TmeetingMinutes['minuteTakerEmployee'] | undefined;
};

// -------------

type Tquery = {
  contractId: string | undefined;
  meetingMinutesId: string | undefined;
};

type TimperativeHandle = {
  add: () => void;
  edit: () => void;
  toList: () => void;
  cancelEdit: () => void;
  reqPostPatch: () => void;
};

type Tstate = {
  isAdd: boolean;
  isEdit: boolean;
  isRead: boolean;
  isLoading?: boolean;
};

export type { TimperativeHandle, Tstate };

// ---------------------------------------------------------------------------

const MeetingMinutes_contract = forwardRef(MeetingMinutes_contract_component);
export default MeetingMinutes_contract;

function MeetingMinutes_contract_component(
  {
    onStateChange,
  }: {
    onStateChange?: (state: Tstate) => void;
  },
  ref: React.ForwardedRef<unknown>
) {
  //
  const router = useRouter();
  const { contractId, meetingMinutesId } = router.query as Tquery;

  const { userInfo } = useContext(AppContext);

  // ------------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);
  const [isLoading_req, setIsLoading_req] = useState(false);
  const [isLoading_edit, setIsLoading_edit] = useState(false);
  // ------------------------------------------------------------------------

  const [state_meetingMinures, setState_meetingMinures] = useState<Tstate_meetingMinutes>();

  const [newFileArr, setNewFileArr] = useState<Tfile[]>([]);
  const [deletedFileDtoArr, setDeletedFileDtoArr] = useState<TfileOriginal[]>([]);

  // ------------------------------------------------------------------------

  const {
    data: meetingMinutesArr,
    update: update_meetingMinutesArr,
    isLoading: isLoading_meetingMinutesArr,
  } = useGetMeetingMinutes<{
    contract: true;
    chairmanEmployee: true;
    attendeesEmployee: true;
    minuteTakerEmployee: true;
  }>();

  // const meetingInEdit = meetingMinutesId ? meetingMinutesArr?.find((v) => v.id === meetingMinutesId) : undefined;

  // ------------------------------------------------------------------------
  const isAdd = !disabled && !meetingMinutesId;
  const isEdit = !disabled && !!meetingMinutesId;
  const isRead = disabled && !!meetingMinutesId;
  const isList = !isAdd && !isEdit && !isRead;

  // ------------------------------------------------------------------------

  const onRowClick = (meetingMinutesId: string) => {
    router.push({
      query: {
        ...router.query,
        meetingMinutesId,
        isAdd: undefined,
      },
    });
  };

  const onFilesChange: TonFilsChange = ({ deleteArr, newFileArr }) => {
    setNewFileArr(newFileArr);
    setDeletedFileDtoArr(deleteArr);
  };

  // ------------------------------------------------------------------------

  const reqPostPatch = async () => {
    const state = state_meetingMinures;

    if (!contractId || !state || !state.chairmanEmployee || !state.minuteTakerEmployee) {
      return;
    }

    let meetingMinuteId = state.id;

    const body: TcreateMeetingMinutesDto = {
      contractId: contractId,
      name: state.name,
      location: state.location,
      chairmanEmployeeId: state.chairmanEmployee?.id,
      attendeesEmployee: state.attendeesEmployee.map((v) => v.id),
      minuteDate: state.minuteDate,
      minuteTakerEmployeeId: state.minuteTakerEmployee?.id,
      content: state.content,
      entryTime: state.entryTime,
      inspctionTime: state.inspectionTime,
      timeline: state.timeline,
      completionTime: state.completionTime,
      formMaker: state.formMaker,
    };

    try {
      if (!meetingMinuteId) {
        const res = await apiPostMeetingMinutes(body);
        meetingMinuteId = res.id;
      } else {
        await apiPatchMeetingMinutes(meetingMinuteId, body);
      }

      await update_meetingMinutesArr();
    } catch (error) {}
  };

  const reqAttachments = async () => {
    if (!meetingMinutesId) {
      return;
    }

    for (const file of deletedFileDtoArr) {
      try {
        await apiDeleteMeetingMinutes_id_attachments(meetingMinutesId, file.id, { showAlert: false });
      } catch (error) {
        const err = error as AxiosError;
        myAlert.err({ title: '刪除附件失敗，刪除流程中止', content: err.message });
        break;
      }
    }

    for (const file of newFileArr) {
      const formData = new FormData();
      formData.append('file', file.file);

      try {
        await apiPostMeetingMinutes_id_attachments(meetingMinutesId, formData, { showAlert: false });
      } catch (error) {
        const err = error as AxiosError;
        myAlert.err({ title: '新增附件失敗，新增流程中止', content: err.message });
        break;
      }
    }
  };
  // ------------------------------------------------------------------------

  useImperativeHandle(
    ref,
    (): TimperativeHandle => ({
      //
      toList: () => {
        router.push({
          query: {
            ...router.query,
            meetingMinutesId: undefined,
          },
        });
        setDisabled(true);
      },
      add: () => {
        router.push({
          query: {
            ...router.query,
            meetingMinutesId: undefined,
          },
        });
        setDisabled(false);
      },
      edit: () => {
        setDisabled(false);
      },
      cancelEdit: () => {
        setDisabled(true);
      },
      reqPostPatch: async () => {
        setIsLoading_req(true);
        await Promise.all([reqPostPatch(), reqAttachments()]);
        setIsLoading_req(false);
      },
      //
    })
  );

  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------

  useEffect(() => {
    update_meetingMinutesArr();
  }, []);

  useEffect(() => {
    onStateChange &&
      onStateChange({
        isAdd,
        isEdit,
        isRead,
        isLoading: isLoading_req || isLoading_edit || isLoading_meetingMinutesArr,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdd, isEdit, isRead]);

  // ---------------------------------------------------------------------------

  return (
    <div>
      {isList && (
        <List className="m-auto" stickyTop={40} onRowClick={onRowClick} meetingMinutesArr={meetingMinutesArr ?? []} />
      )}

      <Edit
        className={classNames(!(isAdd || isEdit) && 'hidden')}
        meetingMinuteId={meetingMinutesId}
        disabled={disabled}
        onStateChange={({ state_meetingMinutes, isLoading_meetingMinute, isLoading_attachments }) => {
          setState_meetingMinures(state_meetingMinutes);
          setIsLoading_edit(isLoading_meetingMinute || isLoading_attachments);
        }}
        onFilesChange={onFilesChange}
        formMakerName={userInfo?.employee?.chName ?? ''}
      />
    </div>
  );
}
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================

const List = ({
  meetingMinutesArr,
  className,
  stickyTop,
  onRowClick,
}: {
  meetingMinutesArr: TmeetingMinutes[];
  className?: string;
  stickyTop?: React.CSSProperties['top'];
  onRowClick: (meetingMinutesId: string) => void;
}) => {
  // ---------------------------------------------------------------------------
  const { control_table } = useMemo(() => {
    const thead: Ttable['thead'] = {
      stickyTop: {
        top: stickyTop,
      },
      cellArr: [
        {
          children: '會議日期',
          width: 200,
          justifyContent: 'center',
        },
        {
          children: '會議名稱',
          flex: '1 0',
          justifyContent: 'center',
        },
      ],
    };

    const tbody: Ttable['tbody'] = {
      rowArr: meetingMinutesArr.map((item, index) => {
        const { id, createdAt, name } = item;

        return {
          onClick: () => {
            onRowClick(id);
          },
          cellArr: [
            {
              children: getTaiwanDateStr(createdAt) ?? '',
              width: 200,
              justifyContent: 'center',
            },
            {
              children: name,
              flex: '1 0',
              justifyContent: 'center',
            },
          ],
        };
      }),
    };
    // const tbody: Ttable['tbody'] = {
    //   rowArr: [
    //     {
    //       onClick: () => {
    //         onRowClick('foo123');
    //       },
    //       cellArr: [
    //         {
    //           children: '2024年02月06日',
    //           width: 200,
    //           justifyContent: 'center',
    //         },
    //         {
    //           children: '第一次工程協調會議紀錄',
    //           flex: '1 0',
    //           justifyContent: 'center',
    //         },
    //       ],
    //     },
    //     ...foo,
    //   ],
    // };

    const control_table: Ttable = {
      thead: thead,
      tbody: tbody,
      haveBorder: true,
    };

    return { control_table };
  }, []);

  return (
    <Wrapper_tab
      className={classNames(className)}
      childrenOption={{
        noBorderTop: true,
      }}
      stickyTop={{
        top: stickyTop,
      }}
    >
      <Table01 {...control_table} />
    </Wrapper_tab>
  );
};

// ============================================================================

const Edit = ({
  meetingMinuteId,
  onStateChange,
  onFilesChange,
  disabled,
  formMakerName,
  className,
}: {
  meetingMinuteId: string | undefined;
  onStateChange: (states: {
    state_meetingMinutes: Tstate_meetingMinutes;
    isLoading_meetingMinute: boolean;
    isLoading_attachments: boolean;
  }) => void;
  onFilesChange: TonFilsChange;
  disabled?: boolean;
  formMakerName?: string;
  className?: string;
}) => {
  type TonChangeKeys = keyof Omit<
    Tstate_meetingMinutes,
    'chairmanEmployee' | 'attendeesEmployee' | 'minuteTakerEmployee'
  >;

  type TselectorKeys = keyof Pick<
    Tstate_meetingMinutes,
    'chairmanEmployee' | 'attendeesEmployee' | 'minuteTakerEmployee'
  >;

  // ---------------------------------------------------------------------

  const [state_meetingMinutes, setState_meetingMinutes] = useState<Tstate_meetingMinutes>(employeeMeetingMinute());

  const [selectorKey, setSelectorKey] = useState<TselectorKeys>();

  // ---------------------------------------------------------------------

  const {
    data: meeingMinute,
    update: update_meetingMinute,
    isLoading: isLoading_meetingMinute,
  } = useGetMeetingMinutes_id(meetingMinuteId);
  const {
    data: attachments,
    update: update_attachments,
    setData: setAttachments,
    isLoading: isLoading_attachments,
  } = useGetMeetingMinutes_id_attachments(meetingMinuteId);
  // ---------------------------------------------------------------------

  const attendeesEmployeeNames = state_meetingMinutes.attendeesEmployee.map((v) => v.chName).join('、');
  const selectorLimit = selectorKey === 'attendeesEmployee' ? undefined : 1;
  const defaultEmpArr = selectorKey === 'attendeesEmployee' ? state_meetingMinutes.attendeesEmployee : undefined;

  // ---------------------------------------------------------------------

  const fileArr: TfileOriginal[] = useMemo(() => {
    const fileArr: TfileOriginal[] =
      attachments?.map((v) => {
        const { id, name, mime } = v;
        const type = mime.includes('image') ? 'image' : mime.includes('pdf') ? 'pdf' : 'other';

        const src = `${process.env.NEXT_PUBLIC_API_BASE_URL}/file/download/${id}`;

        return { id, src, type, name };
      }) ?? [];

    return fileArr;
  }, [attachments]);

  // ---------------------------------------------------------------------

  const onChange = (key: TonChangeKeys, value: string) => {
    setState_meetingMinutes((prev) => ({ ...prev, [key]: value }));
  };

  const onSelectorClick = (key: TselectorKeys) => {
    setSelectorKey(key);
  };

  const onSelectorConfirm = !selectorKey
    ? null
    : (empArr: TemployeeDto[]) => {
        const key = selectorKey;

        if (key === 'attendeesEmployee') {
          setState_meetingMinutes((prev) => ({ ...prev, attendeesEmployee: empArr }));
        } else {
          setState_meetingMinutes((prev) => ({ ...prev, [key]: empArr[0] }));
        }

        setSelectorKey(undefined);
      };

  // ---------------------------------------------------------------------

  useEffect(() => {
    update_meetingMinute();
    update_attachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingMinuteId]);

  useEffect(() => {
    if (disabled) {
      if (!meeingMinute) {
        const empty = employeeMeetingMinute();
        empty.formMaker = formMakerName ?? '';
        setState_meetingMinutes(empty);
        setAttachments(undefined);
      } else {
        setState_meetingMinutes(meeingMinute);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, meeingMinute]);

  useEffect(() => {
    onStateChange &&
      onStateChange({
        state_meetingMinutes,
        isLoading_meetingMinute,
        isLoading_attachments,
      });
  }, [state_meetingMinutes, isLoading_meetingMinute, isLoading_attachments]);

  return (
    <div className={classNames(className)}>
      <Wrapper>
        <Wrapper_inpuSel_01>
          {/*  */}
          <InputSel
            {...inputSelProps}
            className="col-span-2"
            caption="會議名稱"
            showBaseline="auto"
            disabled={disabled}
            inputProps={{
              props: {
                value: state_meetingMinutes.name,
                onChange: (e) => {
                  onChange('name', e.target.value);
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="會議地點"
            showBaseline="auto"
            disabled={disabled}
            inputProps={{
              props: {
                value: state_meetingMinutes.location,
                onChange: (e) => {
                  onChange('location', e.target.value);
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="會議日期"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state_meetingMinutes.minuteDate ? null : moment(state_meetingMinutes.minuteDate),
                onChange: (m) => {
                  onChange('minuteDate', m?.toISOString() ?? '');
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="會議主席"
            showBaseline="auto"
            disabled={disabled}
            onClick={() => {
              onSelectorClick('chairmanEmployee');
            }}
            inputProps={{
              props: {
                value: state_meetingMinutes.chairmanEmployee?.chName ?? '',
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            caption="記錄人員"
            showBaseline="auto"
            disabled={disabled}
            onClick={() => {
              onSelectorClick('minuteTakerEmployee');
            }}
            inputProps={{
              props: {
                value: state_meetingMinutes.minuteTakerEmployee?.chName ?? '',
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            className="col-span-2"
            caption="與會人員"
            showBaseline="auto"
            disabled={disabled}
            onClick={() => {
              onSelectorClick('attendeesEmployee');
            }}
            textareaProps={{
              props: {
                value: attendeesEmployeeNames || '',
                readOnly: true,
              },
            }}
          />

          {/*  */}
          <WrappedTextarea
            className="col-span-2"
            disabled={disabled}
            inputSelProps={{
              caption: '會議記錄',
            }}
            textareaProps={{
              props: {
                value: state_meetingMinutes.content ?? '',
                onChange: (e) => {
                  onChange('content', e.target.value);
                },
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            className="col-span-2"
            caption="工程編號"
            showBaseline="auto"
            disabled={true}
            inputProps={{
              props: {
                value: 'M-999999',
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            caption="進場時間"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state_meetingMinutes.entryTime ? null : moment(state_meetingMinutes.entryTime),
                onChange: (m) => {
                  onChange('entryTime', m?.toISOString() ?? '');
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="消檢時間"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state_meetingMinutes.inspectionTime ? null : moment(state_meetingMinutes.inspectionTime),
                onChange: (m) => {
                  onChange('inspectionTime', m?.toISOString() ?? '');
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="使照時程"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state_meetingMinutes.timeline ? null : moment(state_meetingMinutes.timeline),
                onChange: (m) => {
                  onChange('timeline', m?.toISOString() ?? '');
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="竣工時間"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state_meetingMinutes.completionTime ? null : moment(state_meetingMinutes.completionTime),
                onChange: (m) => {
                  onChange('completionTime', m?.toISOString() ?? '');
                },
              },
            }}
          />

          {/*  */}
          {/*  */}
          <Upload_nameList
            className={'mt-5 col-span-2'}
            style={{ gap: 20 }}
            captionStyle={{ width: 80 }}
            disabled={disabled}
            fileArr={fileArr}
            onFilesChange={onFilesChange}
          />
          {/*  */}
          {/*  */}

          <InputSel
            {...inputSelProps}
            caption="製表日期"
            showBaseline="auto"
            disabled={true}
            inputProps={{
              props: {
                value: getTaiwanDateStr(state_meetingMinutes.createdAt) ?? '',
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="製表人"
            showBaseline="auto"
            disabled={true}
            inputProps={{
              props: {
                value: state_meetingMinutes.formMaker ?? '',
                onChange: () => {},
              },
            }}
          />

          {/*  */}
        </Wrapper_inpuSel_01>
      </Wrapper>
      <EmployeeSelector
        showModal={!!onSelectorConfirm}
        onConfirm={(arr) => {
          onSelectorConfirm && onSelectorConfirm(arr);
        }}
        onCancel={() => {
          setSelectorKey(undefined);
        }}
        selLimit={selectorLimit}
        defaultEmpArr={defaultEmpArr}
      />
    </div>
  );
};

// ============================================================================

const employeeMeetingMinute = (): Tstate_meetingMinutes => ({
  id: undefined,
  createdAt: new Date().toISOString(),

  // 所屬合約
  contract: undefined,
  // 會議名稱
  name: '',
  // 地點
  location: '',
  // 主席
  chairmanEmployee: undefined,
  // 與會人員
  attendeesEmployee: [],
  // 會議時間 date
  minuteDate: '',
  // 記錄人
  minuteTakerEmployee: undefined,
  // 會議記錄內容
  content: '',
  // 進場時間 date
  entryTime: '',
  // 消檢時間 date
  inspectionTime: '',
  // 使照時程 date
  timeline: '',
  // 竣工時間 date
  completionTime: '',
  // 製表人
  formMaker: '',
});

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// const foo = [
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
// ];
