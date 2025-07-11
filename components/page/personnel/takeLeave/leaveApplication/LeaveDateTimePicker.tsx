import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/zh-tw';

dayjs.extend(updateLocale);
dayjs.updateLocale('zh-tw', {
  // 👉 用 TypeScript 允許的方式加上 meridiem
  meridiem: (hour: number) => (hour < 12 ? '上午' : '下午'),
} as any);

interface Props {
  label?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

const LeaveDateTimePicker = ({ label, value, onChange }: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
      <DateTimePicker
        label={label}
        value={value}
        onChange={onChange}
        format="YYYY/MM/DD A HH:mm"
        ampm
        slotProps={{
          textField: {
            placeholder: '年/月/日 -- -- : --',
            size: 'small',
            fullWidth: true,
            InputLabelProps: { shrink: true },
            sx: {
              height: 40,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#616161', // 👉 改這裡：邊框顏色
                  borderRadius: '6px',
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default LeaveDateTimePicker;
