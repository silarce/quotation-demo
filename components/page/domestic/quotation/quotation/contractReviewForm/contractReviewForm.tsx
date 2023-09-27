import { useState } from 'react';
import classNames from 'classnames';

// antd
import { Modal } from 'antd';
import { Radio } from 'antd';
// gear
// import InputSel from 'components/global/gear/inputAndSel_v2/inputSel.tsx';

// css
import scss from './contractReviewForm.module.scss';

type TrowContent = {
  one: string;
  two: string;
  three: string;
};

const emptyRowContentOri = (): TrowContent => ({
  one: '',
  two: '',
  three: '',
});

// ============================================================================
export default function ContractReviewForm() {
  const [rowContent, setRowContent] = useState<TrowContent[]>([emptyRowContentOri()]);

  const add = () => {
    setRowContent((state) => [...state, emptyRowContentOri()]);
  };

  const del = (index: number) => {
    setRowContent((state) => {
      const newState = [...state];
      newState.splice(index, 1);

      return newState;
    });
  };

  const edit = ({ index, key, value }: { index: number; key: keyof TrowContent; value: string }) => {
    setRowContent((state) => {
      const newState = [...state];
      newState[index][key] = value;

      return newState;
    });
  };

  return (
    <Modal
      className={scss.modal}
      visible={true}
      closable={false}
      centered={true}
      destroyOnClose={true}
      footer={null}
      width="800px"
    >
      <div className={scss.container}>
        <p className={scss.title}>合約審核表</p>
        {/*  */}
        <div className={scss.subTitle}>
          <span>合約編號</span>
          <span>S-110211-06</span>
          <span>工程名稱</span>
          <span>台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程</span>
        </div>
        {/*  */}
        <div className={scss.list}>
          <div>1</div>
          <div>
            <span>註明請款日</span>
            <InputBox boxStyle={{ width: '100px' }} />
            <span>，放款日</span>
            <InputBox boxStyle={{ width: '100px' }} />
          </div>
          {/*  */}
          <div>2</div>
          <div className={scss.item2}>
            <div>
              <span>確定請款比例</span>
              <InputBox />
            </div>
            <div className={scss.rowContainer}>
              {rowContent.map((row, index, arr) => {
                const isLast = index === arr.length - 1;
                const theAdd = !isLast || index === 0 ? add : undefined;
                const theDel = isLast && index !== 0 ? () => del(index) : undefined;

                return (
                  <Row
                    //
                    key={index}
                    rowContent={row}
                    onAdd={theAdd}
                    onDel={theDel}
                    edit={edit}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
          {/*  */}
          <div>3</div>
          <div className="flex">
            <span>合理的放款票期</span>
            <InputBox className="flex-auto" />
          </div>
          {/*  */}
          <div>4</div>
          <div>
            <RadioContainer label={'是否出具履約保證票'} labelClassName="mr-[48px]" />
            <p className="text-[13px] text-[red] m-0">嚴禁使用商業本票</p>
          </div>
          {/*  */}
          <div>5</div>
          <div>
            <RadioContainer label={'是否可請訂金款'} labelClassName="mr-[75px]" />
          </div>
          {/*  */}
          <div>6</div>
          <div className="flex">
            合理的保固期 <InputBox boxStyle={{ width: '100px' }} />
            <span>年，備註</span>
            <InputBox className="flex-auto" />
          </div>
          {/*  */}
          <div>7</div>
          <div>
            <RadioContainer label={'是否出具保固票或保固金'} labelClassName="mr-[48px]" />
          </div>
          {/*  */}
          <div>8</div>
          <div>
            <div>
              <RadioContainer label={'是否註明收足90%出具防火證明、出廠證明'} labelClassName="mr-[48px]" />
            </div>
          </div>
          {/*  */}
          <div>9</div>
          <div>
            <div>
              <RadioContainer label={'是否註明收足100%出具保固書'} labelClassName="mr-[48px]" />
            </div>
          </div>
          {/*  */}
          <div>10</div>
          <div>
            <div>
              <RadioContainer label={'請按裝款時是否需配合工地試車'} labelClassName="mr-[48px]" />
            </div>
          </div>
          {/*  */}
          <div>11</div>
          <div>
            <span>扣款項目及其比例、金額（例如保險費、清潔費...等）：</span>
          </div>
          {/*  */}
        </div>

        <div>
          <div>
            <IconCaution />
          </div>
          <div>
            <span>
              簽訂合約，須注意以上事項，協助把關以利工務執行順暢、款項順利回收，合約成立後請將此審核表與合約一起轉工務部，謝謝！
            </span>
          </div>
        </div>

        {/*  */}
      </div>
    </Modal>
  );
}

const InputBox = ({
  prefix,
  suffix,
  boxStyle,
  inputAttr,
  className,
}: {
  prefix?: string;
  suffix?: string;
  boxStyle?: React.CSSProperties;
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}) => {
  return (
    <div style={boxStyle} className={classNames(scss.inputBox, className)}>
      <span>{prefix}</span>
      <input type="text" {...inputAttr} />
      <span>{suffix}</span>
    </div>
  );
};

const Row = ({
  rowContent,
  onAdd,
  onDel,
  edit,
  index,
}: {
  rowContent: TrowContent;
  onAdd?: () => void;
  onDel?: () => void;
  edit: ({ index, key, value }: { index: number; key: keyof TrowContent; value: string }) => void;
  index: number;
}) => {
  return (
    <div className={scss.row}>
      <div>
        <InputBox
          prefix={`${index + 1}.`}
          inputAttr={{
            value: rowContent.one,
            onChange: (e) => {
              edit({
                index,
                key: 'one',
                value: e.target.value,
              });
            },
          }}
        />
        <InputBox
          suffix="%"
          inputAttr={{
            value: rowContent.two,
            onChange: (e) => {
              edit({
                index,
                key: 'two',
                value: e.target.value,
              });
            },
          }}
        />
        <InputBox
          prefix="備註 :"
          inputAttr={{
            value: rowContent.three,
            onChange: (e) => {
              edit({
                index,
                key: 'three',
                value: e.target.value,
              });
            },
          }}
        />
      </div>
      <div>
        {onAdd && <IconAdd attr={{ onClick: onAdd }} />}
        {onDel && <IconDel attr={{ onClick: onDel }} />}
      </div>
    </div>
  );
};

const IconAdd = ({ attr }: { attr?: React.SVGProps<SVGSVGElement> }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      //
      {...attr}
    >
      <circle cx="9" cy="9" r="8.5" stroke="#14256A" />
      <line x1="4.5" y1="9" x2="13.5" y2="9" stroke="#14256A" />
      <line x1="9" y1="4.5" x2="9" y2="13.5" stroke="#14256A" />
    </svg>
  );
};

const IconDel = ({ attr }: { attr?: React.SVGProps<SVGSVGElement> }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      //
      {...attr}
    >
      <circle cx="9" cy="9" r="8.5" stroke="#14256A" />
      <line x1="4.5" y1="9" x2="13.5" y2="9" stroke="#14256A" />
    </svg>
  );
};

const IconCaution = ({ attr }: { attr?: React.SVGProps<SVGSVGElement> }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8.5" stroke="#14256A" />
      <path d="M9.83333 10.5H8.16667L7.75 7.26923V3.5H10.25V7.26923L9.83333 10.5Z" fill="#14256A" />
      <circle cx="9" cy="13.25" r="1.25" fill="#14256A" />
    </svg>
  );
};

const RadioContainer = ({
  label,
  className,
  labelClassName,
}: {
  label: string;
  className?: string;
  labelClassName?: string;
}) => {
  return (
    <div className={classNames(className)}>
      <span className={classNames('inline-block', labelClassName)}>{label}</span>
      <Radio.Group>
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
      </Radio.Group>
    </div>
  );
};
