import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Link from 'next/link';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconDetail, IconEdit, IconCheck02 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from '../queryQuotationList.module.scss';

// =======================================================================

type Tcontrol_panelHeader = {
  quotationNumber: string;
  status: React.ReactNode;
  quoteDate: string;
  county: string;
  projectName: string;
  customerName: string;
  contactPerson: string;
  contactPhoneNumber: string;
  href: Parameters<typeof Link>[0]['href'];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  //
  processChain: Tcontrol_processChain['statusArr'];
  //

  trackProgress: string;
  projectProgress: string;
  onEditConfirm: (props: { trackProgress: string; projectProgress: string }) => Promise<boolean>;
  isAttachQuotation?: boolean;
};

export type { Tcontrol_panelHeader };

// =======================================================================

export default function PanelHeader({
  //
  control,
  isActive,
}: {
  control: Tcontrol_panelHeader;
  isActive: boolean;
}) {
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [state_trackProgress, setState_trackProgress] = useState(control.trackProgress);
  const [state_projectProgress, setState_projectProgress] = useState(control.projectProgress);

  // -----------------------------------------------------------------
  const {
    quotationNumber,
    status,
    quoteDate,
    county,
    projectName,
    customerName,
    contactPerson,
    contactPhoneNumber,
    href,
    viewRef_bottom,
    //
    processChain,
    //
    trackProgress,
    projectProgress,
    onEditConfirm,

    isAttachQuotation,
  } = control;

  // -----------------------------------------------------------------

  const switchDisabled = () => {
    setDisabled((state) => !state);
  };

  const onConfirm = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const res = await onEditConfirm?.({ trackProgress: state_trackProgress, projectProgress: state_projectProgress });
    setIsLoading(false);

    if (!!res) {
      setDisabled(true);
    }
  };

  // -----------------------------------------------------------------

  useEffect(() => {
    if (disabled) {
      setState_trackProgress(trackProgress);
      setState_projectProgress(projectProgress);
    }
  }, [trackProgress, projectProgress, disabled]);

  // -----------------------------------------------------------------

  return (
    <CellWithBar className={scss.panelHeader} isActive={isActive}>
      <div className={scss.info}>
        <span ref={viewRef_bottom}>{quotationNumber}</span>
        <span className={scss.step}>{status}</span>
        <span>{quoteDate}</span>
        <span>{county}</span>
        <span className={scss.clientName}>{projectName}</span>
        <span className={scss.clientName}>{customerName}</span>
        <span>{contactPerson}</span>
        <span>{contactPhoneNumber}</span>
        <div>
          <Link href={href}>
            <IconDetail
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Link>
        </div>
      </div>
      {/*  */}

      <div className={scss.progress}>
        <InputSel
          onClick={(e) => {
            if (!disabled) {
              e.stopPropagation();
            }
          }}
          disabled={disabled}
          caption="追蹤狀態"
          captionSize="16"
          fontSize="16"
          showBaseline="invisible"
          textareaProps={{
            allowNewLineByUser: true,
            props: {
              value: state_trackProgress,
              onChange: (e) => {
                setState_trackProgress(e.target.value);
              },
              // 阻止collapse展開，必須用onKeyPress，onKeyDown無效
              onKeyPress: (e) => {
                e.stopPropagation();
              },
              className: classNames(scss.textarea, !disabled && scss.enabled, disabled && 'cursor-pointer'),
              disabled: false,
              readOnly: disabled,
              minRows: 3,
              maxRows: 3,
            },
          }}
        />
        <InputSel
          onClick={(e) => {
            if (!disabled) {
              e.stopPropagation();
            }
          }}
          disabled={disabled}
          caption="工地進度"
          captionSize="16"
          fontSize="16"
          showBaseline="invisible"
          textareaProps={{
            allowNewLineByUser: true,
            props: {
              value: state_projectProgress,
              onChange: (e) => {
                setState_projectProgress(e.target.value);
              },
              // 阻止collapse展開，必須用onKeyPress，onKeyDown無效
              onKeyPress: (e) => {
                e.stopPropagation();
              },
              className: classNames(scss.textarea, !disabled && scss.enabled, disabled && 'cursor-pointer'),
              disabled: false,
              readOnly: disabled,
              minRows: 3,
              maxRows: 3,
            },
          }}
        />
        <div className={scss.panel}>
          <IconEdit
            className={classNames(scss.btn_edit, !disabled && scss.enabled)}
            onClick={(e) => {
              e.stopPropagation();
              switchDisabled();
            }}
          />
          {!disabled && (
            <IconCheck02
              onClick={(e) => {
                e.stopPropagation();
                onConfirm();
              }}
            />
          )}
        </div>
      </div>

      {/*  */}
      <div className={classNames(scss.chainWrapper, 'mt-5')}>
        <ProcessChain control={{ statusArr: processChain }} />
        <div>{isAttachQuotation && '追加追減報價單'}</div>
      </div>
    </CellWithBar>
  );
}
