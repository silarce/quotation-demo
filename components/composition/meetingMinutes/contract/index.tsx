import { useState, useEffect } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// component
import { MeetingMinuteList } from './list';
import { MeetingMinuteEdit, Tstate_meetingMinutes } from './edit';

// gear
import { Tfile, TfileOriginal, TonFilsChange } from 'components/global/gear/upload/upload_nameList/upload_nameList';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  AxiosError,
  //
  TcreateMeetingMinutesDto,
  //
  useGetMeetingMinutes,
  apiPostMeetingMinutes,
  apiPatchMeetingMinutes,
  //
  apiPostMeetingMinutes_id_attachments,
  apiDeleteMeetingMinutes_id_attachments,
} from 'js/api/api_meetingMinutes';

// ---------------------------------------------------------------------------

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

    if (!contractId || !state || !state.chairmanEmployee || !state.minuteTakerEmployee || !state.formMakerEmployee) {
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
      formMakerEmployeeId: state.formMakerEmployee?.id,
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

  useEffect(() => {
    update_meetingMinutesArr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <MeetingMinuteList
          className="m-auto"
          stickyTop={40}
          onRowClick={onRowClick}
          meetingMinutesArr={meetingMinutesArr ?? []}
        />
      )}

      <MeetingMinuteEdit
        className={classNames(!(isAdd || isEdit) && 'hidden')}
        meetingMinuteId={meetingMinutesId}
        disabled={disabled}
        onStateChange={({ state_meetingMinutes, isLoading_meetingMinute, isLoading_attachments }) => {
          setState_meetingMinures(state_meetingMinutes);
          setIsLoading_edit(isLoading_meetingMinute || isLoading_attachments);
        }}
        onFilesChange={onFilesChange}
      />
    </div>
  );
}
