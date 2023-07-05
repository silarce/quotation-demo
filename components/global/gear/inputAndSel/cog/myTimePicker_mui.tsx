
import { useRef, useState, } from "react"

import classNames from "classnames";

import { Moment } from "moment";

// mui
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';

// css
import scss from "../inputSel.module.scss"

export type TtimePickerProps_mui = {
  defaultValue?: Moment | null
  value?: Moment | null
  onAccept?: (v: { moment: Moment, isoString: string, dateString: string }) => void
  TimePickerProps?: TimePickerProps<Moment>
  wrapperClassName?: string
  className?: string
}


// ==============================================================================
export default function MyTimePicker_mui(
  { timePickerProps_mui }:
    { timePickerProps_mui: TtimePickerProps_mui }
) {

  const ref = useRef<HTMLDivElement>(null!)
  const [open, setOpen] = useState(false)

  const {
    defaultValue,
    value,
    onAccept,
    TimePickerProps,
    wrapperClassName,
    className,
  } = timePickerProps_mui


  return (
    <div ref={ref} className={classNames(scss.timePicker_mui_wrapper, wrapperClassName)}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <TimePicker className={classNames(scss.timePicker_mui, className)}
          open={open}

          defaultValue={defaultValue}
          value={value}

          onClose={() => setOpen(false)}
          onAccept={(date) => {
            setOpen(false)
            if (onAccept) {
              onAccept({
                moment: date!,
                isoString: date!.toISOString(),
                dateString: date!.format("HH:mm"),
              })
            }
          }}

          /**	If true, the open picker button will not be rendered (renders only the field). */
          // disableOpenPicker={true}

          ampm={false}
          slotProps={{
            popper: { anchorEl: ref.current },
          }}

          slots={{
            field: (params) => {
              return (
                <TimeField
                  {...params}
                  onClick={(e) => {
                    // @ts-ignore
                    if (params.onClick) params.onClick(e)
                    setOpen(true)
                  }}
                />
              );
            }
          }}
          {...TimePickerProps}
        />
      </LocalizationProvider>
    </div>
  )
}





