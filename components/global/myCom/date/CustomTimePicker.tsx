import React, { useState, useRef } from 'react';
import { Popover, TextField, ClickAwayListener, Button } from '@mui/material';
import classNames from 'classnames';

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
const ampmList = ['上午', '下午'];

const PickerColumn = ({
  list,
  selected,
  onChange,
}: {
  list: string[];
  selected: string;
  onChange: (val: string) => void;
}) => (
  <div className="flex flex-col items-center overflow-y-auto max-h-[160px]">
    {list.map((item) => (
      <div
        key={item}
        className={classNames(
          'w-[50px] text-center py-1 rounded cursor-pointer',
          selected === item ? 'bg-gray-300 text-black font-semibold' : 'text-black'
        )}
        onClick={() => onChange(item)}
      >
        {item}
      </div>
    ))}
  </div>
);

export default function CustomTimeInputWithOk({ onChange }: { onChange?: (val: string) => void }) {
  // const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const ref_anchorEl = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  const [displayValue, setDisplayValue] = useState('- - : - -');
  const [tempAmPm, setTempAmPm] = useState('上午');
  const [tempHour, setTempHour] = useState('01');
  const [tempMinute, setTempMinute] = useState('00');

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    // setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleOk = () => {
    const result = `${tempAmPm} ${tempHour}:${tempMinute}`;
    setDisplayValue(result);
    setOpen(false);
    onChange?.(result); // 如果有傳入 onChange，就呼叫它
  };

  return (
    <>
      <TextField
        ref={(ele) => {
          ref_anchorEl.current = ele;
        }}
        value={displayValue}
        fullWidth
        onClick={handleOpen}
        inputProps={{ readOnly: true }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#616161',
              borderRadius: '6px',
            },
            '& .MuiOutlinedInput-root': {
              padding: 0,
              height: '40px',
              alignItems: 'center',
            },
            '& .MuiInputBase-input': {
              padding: '10px 14px',
              height: '100%',
              boxSizing: 'border-box',
            },
          },
        }}
        className="ml-[8px]"
      />

      <Popover
        open={open}
        anchorEl={ref_anchorEl.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <div className="bg-white p-4 rounded-md shadow-md flex flex-col gap-4">
            <div className="flex gap-4">
              <PickerColumn list={ampmList} selected={tempAmPm} onChange={setTempAmPm} />
              <PickerColumn list={hours} selected={tempHour} onChange={setTempHour} />
              <PickerColumn list={minutes} selected={tempMinute} onChange={setTempMinute} />
            </div>
            <div className="flex justify-end mt-2">
              <Button onClick={handleOk} variant="contained" size="small">
                OK
              </Button>
            </div>
          </div>
        </ClickAwayListener>
      </Popover>
    </>
  );
}
