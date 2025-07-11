import { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  value?: Option | null;
  onChange: (value: Option) => void;
}

export default function CustomSelect({ options, placeholder = '請選擇編號', value, onChange }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 點擊外面關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className="flex justify-between items-center border border-[#616161] rounded-md  px-3 py-2 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`${!value ? 'text-[#909090]' : 'text-black'}`}>{value ? value.label : placeholder}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="absolute z-10 w-full  border border-gray-300 bg-white rounded shadow top-[105%]">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="px-3 py-2 hover:bg-blue-100 text-sm cursor-pointer "
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
