import { useState, useEffect, useMemo, useContext } from 'react';
import classNames from 'classnames';
import moment from 'moment';

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
  TfileOriginal,
  TonFilsChange,
  //
  Upload_nameList,
} from 'components/global/gear/upload/upload_nameList/upload_nameList';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// api
import {
  TmeetingMinutesDto,
  useGetMeetingMinutes_id,
  useGetMeetingMinutes_id_attachments,
} from 'js/api/api_meetingMinutes';

// context
import { AppContext } from 'pages/_app';

// ================================================================================================

type TmeetingMinutes = TmeetingMinutesDto<{
  contract: true;
  chairmanEmployee: true;
  attendeesEmployee: true;
  minuteTakerEmployee: true;
  formMakerEmployee: true;
}>;

type Tstate_meetingMinutes = Omit<
  TmeetingMinutes,
  | 'chairmanEmployeeId'
  | 'minuteTakerEmployeeId'
  | 'contractId'
  | 'contract'
  | 'chairmanEmployee'
  | 'minuteTakerEmployee'
  | 'formMakerEmployee'
  | 'id'
  | 'updatedAt'
> & {
  id: string | undefined;
  contract: TmeetingMinutes['contract'] | undefined;
  chairmanEmployee: TmeetingMinutes['chairmanEmployee'] | undefined;
  minuteTakerEmployee: TmeetingMinutes['minuteTakerEmployee'] | undefined;
  formMakerEmployee: TmeetingMinutes['formMakerEmployee'] | undefined;
};

export type { Tstate_meetingMinutes };

// ================================================================================================
export const MeetingMinuteEdit = ({
  meetingMinuteId,
  onStateChange,
  onFilesChange,
  disabled,
  // formMakerName,
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
  // formMakerName?: string;
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

  const { userInfo } = useContext(AppContext);

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
        empty.formMakerEmployee = userInfo?.employee;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            disabled={disabled}
            // onClick={() => {
            //   // onSelectorClick('formMakerEmployee');
            // }}
            inputProps={{
              props: {
                value: state_meetingMinutes.formMakerEmployee?.chName ?? '',
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

// =============================================================================
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
  formMakerEmployee: undefined,
});
