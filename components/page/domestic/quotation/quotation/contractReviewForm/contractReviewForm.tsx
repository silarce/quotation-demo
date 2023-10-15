import { useState, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import Decimal from 'decimal.js';
import { useForm, useFormState } from 'react-hook-form';
import moment from 'moment';

// antd
import { Modal } from 'antd';
import { Radio } from 'antd';
// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// api
import { Tparams, TemployeeDto, useEmployee_infinite } from 'js/api/api_employee';
import { apiSubmitContracting } from 'js/api/api_quotation';

// css
import scss from './contractReviewForm.module.scss';

// type
import { TpaymentRatioDto, TcreateQuotationVerifyFormDto, TquotationVerifyFormDto } from 'js/api/dtoTypes';

// ============================================================================
export default function ContractReviewForm({
  showModal,
  close,
  contractIdNumber,
  contractName,
  contractPrice,
  lastestContentId,
  verifyForm,
  onConfirm,
}: {
  showModal: boolean;
  close: () => void;
  contractIdNumber: string;
  contractName: string;
  contractPrice: number;
  lastestContentId: string | undefined;
  verifyForm: TquotationVerifyFormDto | undefined;
  onConfirm?: () => void;
}) {
  // ----------------------------------------------------------------------------

  const { payMethodList, addMethod, resetMethodList, getMethodBodyArr, allPercentStr } = usePayMethod({
    contractPrice,
  });

  // const { register, control, reset, watch, setValue } = useForm<TcontractReviewForm>();
  const { register, control, reset, watch, setValue, getValues } =
    useForm<Omit<TcreateQuotationVerifyFormDto, 'TpaymentRatioDto'>>();

  const watchData = watch();

  // ----------------------------------------------------------------------------
  // 被選的employee
  const [selEmployeeIdArr, setSelEmployeeIdArr] = useState<string[]>([]);

  const params = {
    pageSize: 20,
    populate: ['jobs.department'],
    sort: 'idNumber',
    filter: {
      'jobs.department.name': { $eq: '工務部' },
    },
  };

  const {
    dataArr: empArr,
    viewRef_bottom,
    isLoadingPage1,
    reset: resetEmp,
  } = useEmployee_infinite({ customParams: params });

  useEffect(() => {
    if (!showModal) {
      setSelEmployeeIdArr([]);

      return;
    }

    // verifyForm

    if (verifyForm) {
      reset({
        askForPaymentDate: verifyForm.askForPaymentDate,
        disbursementDate: verifyForm.disbursementDate,
        // paymentRatio: verifyForm.paymentRatio,
        paymentTenor: verifyForm.paymentTenor,
        performanceBond: verifyForm.performanceBond,
        depositPayment: verifyForm.depositPayment,
        warrantyPeriod: verifyForm.warrantyPeriod,
        note: verifyForm.note,
        warrantyPayment: verifyForm.warrantyPayment,
        fireproofCertificate: verifyForm.fireproofCertificate,
        warranty: verifyForm.warranty,
        testDrive: verifyForm.testDrive,
        debitItem: verifyForm.debitItem,
        // workDirectorId: verifyForm.workDirectorId,
      });
    } else {
      reset({
        askForPaymentDate: undefined,
        disbursementDate: undefined,
        paymentTenor: undefined,
        performanceBond: undefined,
        depositPayment: undefined,
        warrantyPeriod: undefined,
        note: undefined,
        warrantyPayment: undefined,
        fireproofCertificate: undefined,
        warranty: undefined,
        testDrive: undefined,
        debitItem: undefined,
      });
    }

    setSelEmployeeIdArr([verifyForm?.workDirectorId ?? '']);
    resetEmp();

    const methodArr = verifyForm?.paymentRatio.map((item) => {
      return {
        title: item.level,
        percent: item.paymentRatio,
        price: item.price,
        note: item.note,
      };
    });

    resetMethodList({ defaultPayMethodArr: methodArr });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // ------------------------------------------------------------------
  const onClick = (newEmp: TemployeeDto) => {
    // const newArr = [...selEmployeeIdArr];

    setSelEmployeeIdArr([newEmp.id]);

    // if (selLimit === 1) {
    //   newArr[0] = newEmp;
    //   setSelEmployeeArr(newArr);

    //   return;
    // }

    // const theIndex = newArr.findIndex((emp) => emp.id === newEmp.id);

    // if (theIndex > -1) {
    //   newArr.splice(theIndex, 1);
    // } else {
    //   newArr.push(newEmp);
    // }

    // setSelEmployeeArr(newArr);
  };

  const theOnConfirm = async () => {
    if (!lastestContentId) {
      return;
    }

    const preBody = watch();

    const body: TcreateQuotationVerifyFormDto = {
      // array
      paymentRatio: Object.values(payMethodList).map((item) => item.body),
      // date
      askForPaymentDate: preBody.askForPaymentDate,
      disbursementDate: preBody.disbursementDate,
      paymentTenor: preBody.paymentTenor,
      // boolean
      performanceBond: preBody.performanceBond,
      depositPayment: preBody.depositPayment,
      warrantyPayment: preBody.warrantyPayment,
      fireproofCertificate: preBody.fireproofCertificate,
      warranty: preBody.warranty,
      testDrive: preBody.testDrive,
      // string
      warrantyPeriod: preBody.warrantyPeriod ?? '',
      note: preBody.note ?? '',
      debitItem: preBody.debitItem ?? '',
      //
    };

    let isPaymentOk = true;
    body.paymentRatio.forEach((item) => {
      const { level, paymentRatio, price, note } = item;

      if (!level || !paymentRatio || !price || !note) {
        isPaymentOk = false;
      }
    });

    if (!body.askForPaymentDate || !body.disbursementDate || !body.paymentTenor) {
      return myAlert.warning({ title: '請填寫所有日期' });
    } else if (
      body.performanceBond === undefined ||
      body.depositPayment === undefined ||
      body.warrantyPayment === undefined ||
      body.fireproofCertificate === undefined ||
      body.warranty === undefined ||
      body.testDrive === undefined
    ) {
      return myAlert.warning({ title: '請填寫所有二選一選項' });
    } else if (!isPaymentOk) {
      return myAlert.warning({ title: '請確實設定請款比例' });
    }

    try {
      await apiSubmitContracting({ contentId: lastestContentId, body });
    } catch (error) {
      myAlert.err({ title: '送審失敗' });
    }

    close();
    onConfirm && onConfirm();
  };

  const onCancel = () => {
    // onCancel();
    // setSelEmployeeArr([]);
    close();
  };

  // ----------------------------------------------------------------------------

  return (
    <Modal
      className={scss.modal}
      visible={showModal}
      closable={false}
      centered={true}
      destroyOnClose={true}
      footer={null}
      width="800px"
      onCancel={onCancel}
    >
      <div className={scss.container}>
        <p className={scss.title}>合約審核表</p>
        {/*  */}
        <div className={scss.subTitle}>
          <span>合約編號</span>
          <span>{contractIdNumber}</span>
          <span>工程名稱</span>
          <span>{contractName}</span>
        </div>
        {/*  */}
        <div className={scss.list}>
          <div>1</div>
          <div>
            <span>註明請款日</span>
            <InputSel
              className={scss.datePicker}
              datePickerProps={{
                props: {
                  value: watchData.askForPaymentDate ? moment(watchData.askForPaymentDate) : null,
                  onChange: (md) => {
                    setValue('askForPaymentDate', md?.toISOString() ?? '');
                  },
                },
              }}
            />
            <span>，放款日</span>
            <InputSel
              className={scss.datePicker}
              datePickerProps={{
                props: {
                  value: watchData.disbursementDate ? moment(watchData.disbursementDate) : null,
                  onChange: (md) => {
                    setValue('disbursementDate', md?.toISOString() ?? '');
                  },
                },
              }}
            />
          </div>
          {/*  */}
          <div>2</div>
          <div className={scss.item2}>
            <div>
              <span>確定請款比例</span>
              <InputBox inputAttr={{ className: 'pl-4', value: allPercentStr, disabled: true }} />
            </div>
            <div className={scss.payMethodContainer}>
              {Object.values(payMethodList).map((item, index, arr) => {
                const onDel = arr.length > 1 ? item.delSelf : undefined;

                return (
                  <Row
                    key={index}
                    onAdd={addMethod}
                    onDel={onDel}
                    serialNumber={index + 1}
                    title={{
                      value: item.title,
                      onChange: (e) => {
                        item.title = e.target.value;
                      },
                    }}
                    percent={{
                      value: item.percent,
                      onChange: (e) => {
                        item.percent = e.target.value;
                      },
                    }}
                    price={{
                      value: item.price,
                      // onChange: (e) => {
                      //   item.price = e.target.value;
                      // },
                    }}
                    note={{
                      value: item.note,
                      onChange: (e) => {
                        item.note = e.target.value;
                      },
                    }}
                  />
                );
              })}
            </div>
          </div>
          {/*  */}
          <div>3</div>
          <div className="flex">
            <span>合理的放款票期</span>
            {/* <InputBox className="flex-auto" inputAttr={{ ...register('paymentTenor') }} /> */}
            <InputSel
              className={scss.datePicker}
              datePickerProps={{
                props: {
                  value: watchData.paymentTenor ? moment(watchData.paymentTenor) : null,
                  onChange: (md) => {
                    setValue('paymentTenor', md?.toISOString() ?? '');
                  },
                },
              }}
            />
          </div>
          {/*  */}
          <div>4</div>
          <div>
            <RadioContainer
              label={'是否出具履約保證票'}
              labelClassName="mr-[48px]"
              value={watchData.performanceBond}
              onChange={(v) => {
                setValue('performanceBond', v);
              }}
            />
            <p className="text-[13px] text-[red] m-0">嚴禁使用商業本票</p>
          </div>
          {/*  */}
          <div>5</div>
          <div>
            <RadioContainer
              label={'是否可請訂金款'}
              labelClassName="mr-[75px]"
              value={watchData.depositPayment}
              onChange={(v) => {
                setValue('depositPayment', v);
              }}
            />
          </div>
          {/*  */}
          <div>6</div>
          <div className="flex">
            合理的保固期{' '}
            <InputBox
              boxStyle={{ width: '60px' }}
              inputAttr={{ ...register('warrantyPeriod'), className: 'text-center' }}
            />
            <span>年，備註</span>
            <InputBox className="flex-auto" inputAttr={{ ...register('note') }} />
          </div>
          {/*  */}
          <div>7</div>
          <div>
            <RadioContainer
              label={'是否出具保固票或保固金'}
              labelClassName="mr-[48px]"
              value={watchData.warrantyPayment}
              onChange={(v) => {
                setValue('warrantyPayment', v);
              }}
            />
          </div>
          {/*  */}
          <div>8</div>
          <div>
            <div>
              <RadioContainer
                label={'是否註明收足90%出具防火證明、出廠證明'}
                labelClassName="mr-[48px]"
                value={watchData.fireproofCertificate}
                onChange={(v) => {
                  setValue('fireproofCertificate', v);
                }}
              />
            </div>
          </div>
          {/*  */}
          <div>9</div>
          <div>
            <div>
              <RadioContainer
                label={'是否註明收足100%出具保固書'}
                labelClassName="mr-[48px]"
                value={watchData.warranty}
                onChange={(v) => {
                  setValue('warranty', v);
                }}
              />
            </div>
          </div>
          {/*  */}
          <div>10</div>
          <div>
            <div>
              <RadioContainer
                label={'請按裝款時是否需配合工地試車'}
                labelClassName="mr-[48px]"
                value={watchData.testDrive}
                onChange={(v) => {
                  setValue('testDrive', v);
                }}
              />
            </div>
          </div>
          {/*  */}
          <div>11</div>
          <div>
            <span>扣款項目及其比例、金額（例如保險費、清潔費...等）：</span>
            <br />
            <div className={scss.textaraeBox}>
              <textarea className="w-full resize-none" placeholder="請輸入" {...register('debitItem')} />
            </div>
          </div>
          {/*  */}
        </div>

        <div className={scss.footer}>
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
        {/* 不需要了`,api更新後要拿掉 */}
        {/* <div className="mt-9">
          <p className="text-main text-[18px] text-center mb-[18px]">請選擇送審人員</p>
          <div className={scss.table}>
            <RowArr
              empArr={empArr}
              selEmployeeIdArr={selEmployeeIdArr}
              viewRef_bottom={viewRef_bottom}
              onClick={onClick}
            />
          </div>
        </div> */}

        <div className={scss.btnBox}>
          <MyButton_v2 label="確定" theme="danger" onClick={theOnConfirm} px="px44" />
          <MyButton_v2 label="取消" onClick={onCancel} px="px44" />
        </div>

        {/*  */}
      </div>
    </Modal>
  );
}

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
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
  serialNumber,
  onAdd,
  onDel,
  title,
  percent,
  price,
  note,
}: {
  serialNumber: number;
  onAdd?: () => void;
  onDel?: () => void;
  title: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  percent: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  price: {
    value: string;
    // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  note: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}) => {
  return (
    <div className={scss.payMethod}>
      <div>
        <InputBox
          prefix={`${serialNumber}.`}
          inputAttr={{
            value: title.value,
            onChange: title.onChange,
            placeholder: '請輸入標題',
          }}
        />
        <InputBox
          suffix="%"
          inputAttr={{
            value: percent.value,
            onChange: percent.onChange,
            type: 'number',
            placeholder: '請輸入比例',
          }}
        />
        <InputBox
          prefix="$"
          inputAttr={{
            className: 'text-center',
            value: price.value,
            // onChange: price.onChange,
            type: 'number',
            disabled: true,
          }}
        />
        <InputBox
          prefix="備註 :"
          inputAttr={{
            value: note.value,
            onChange: note.onChange,
            placeholder: '請輸入備註',
          }}
        />
      </div>
      <div>
        <IconAdd attr={{ onClick: onAdd }} />
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
  value,
  onChange,
}: {
  label: string;
  className?: string;
  labelClassName?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => {
  return (
    <div className={classNames(className)}>
      <span className={classNames('inline-block', labelClassName)}>{label}</span>
      <Radio.Group onChange={(e) => onChange(e.target.value)} value={value}>
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
      </Radio.Group>
    </div>
  );
};

const RowArr = ({
  empArr,
  selEmployeeIdArr,
  // skipArr,
  viewRef_bottom,
  // exceptEmpArr,
  onClick,
}: // exceptEmpCheck,
{
  empArr: TemployeeDto[];
  selEmployeeIdArr: string[];
  // skipArr?: TemployeeDto[];
  onClick: (v: TemployeeDto) => void;
  // exceptEmpArr?: { id: string }[];
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  // exceptEmpCheck: ((emp: TemployeeDto) => boolean) | undefined;
}) => {
  return (
    <>
      {empArr.map((emp, index, arr) => {
        const { idNumber, chName, jobs } = emp;
        const { name, grade, department } = jobs?.[0] ?? {};

        const theViewRef = (() => {
          if (arr.length - 11 === index) {
            return viewRef_bottom;
          }

          return undefined;
        })();

        const isActive = selEmployeeIdArr.some((selEmpId) => selEmpId === emp.id);

        return (
          <CellWithBar key={index} isActive={isActive}>
            <div className={classNames(scss.row)} onClick={() => onClick(emp)} ref={theViewRef}>
              <span className={scss.idNumber}>{idNumber}</span>
              <span>{chName}</span>
              <span>{name ? `${department?.name} / ${name}` : ''}</span>
              <span>{grade && `Level ${grade}`}</span>
            </div>
          </CellWithBar>
        );
      })}
    </>
  );
};

// ============================================================================

type TpayMethod = {
  title: string;
  percent: string;
  price: string;
  note: string;
};

const creEmptyMethod = () => {
  return {
    title: '',
    percent: '',
    price: '',
    note: '',
  };
};

class Class_payMethod {
  constructor({
    //
    reRender,
    payMethod,
    contractPrice,
    delSelf,
  }: {
    reRender: () => void;
    payMethod: TpayMethod;
    contractPrice: number;
    delSelf: () => void;
  }) {
    this.reRender = reRender;
    this._payMethod = _.cloneDeep(payMethod);
    this.contractPrice = contractPrice;

    this.delSelf = delSelf;
  } // constructor

  readonly reRender;
  readonly delSelf;
  private _payMethod;
  readonly contractPrice;

  get title() {
    return this._payMethod.title;
  }
  set title(v) {
    this._payMethod.title = v;
    this.reRender();
  }

  get percent() {
    return this._payMethod.percent;
  }
  set percent(str) {
    const num = Number(str || 0);
    this._payMethod.percent = str;
    this._payMethod.price = new Decimal(this.contractPrice).mul(num).div(100).toString();
    this.reRender();
  }

  get price() {
    return this._payMethod.price;
  }
  // set price(v) {
  //   this._payMethod.price = v;
  //   this.reRender();
  // }

  get note() {
    return this._payMethod.note;
  }
  set note(v) {
    this._payMethod.note = v;
    this.reRender();
  }

  get body(): TpaymentRatioDto {
    return {
      level: this.title,
      paymentRatio: this.percent,
      price: this.price,
      note: this.note,
    };
  }
}

type TpayMethodList = {
  [key: string]: Class_payMethod;
};

const usePayMethod = ({ contractPrice }: { contractPrice: number }) => {
  const [render, setRender] = useState(0);
  const [payMethodList, setPayMethodList] = useState<TpayMethodList>({});

  const reRender = () => {
    setRender((state) => state + 1);
  };

  const creDelMethod = (list: TpayMethodList) => {
    return (key: string) => {
      delete list[key];
      reRender();
    };
  };

  const addMethod = () => {
    const newKey = nanoid();
    payMethodList[newKey] = new Class_payMethod({
      reRender,
      payMethod: creEmptyMethod(),
      delSelf: () => creDelMethod(payMethodList)(newKey),
      contractPrice,
    });
    reRender();
  };

  const resetMethodList = ({ defaultPayMethodArr }: { defaultPayMethodArr?: TpayMethod[] } = {}) => {
    const newList: TpayMethodList = {};

    if (defaultPayMethodArr) {
      defaultPayMethodArr.forEach((item) => {
        const newKey = nanoid();
        newList[newKey] = new Class_payMethod({
          reRender,
          payMethod: item,
          delSelf: () => creDelMethod(newList)(newKey),
          contractPrice,
        });
      });
    } else {
      const newKey = nanoid();
      newList[newKey] = new Class_payMethod({
        reRender,
        payMethod: creEmptyMethod(),
        delSelf: () => creDelMethod(newList)(newKey),
        contractPrice,
      });
    }

    setPayMethodList(newList);
  };

  useEffect(() => {
    resetMethodList();
  }, []);

  const getMethodBodyArr = () => {
    const arr = Object.values(payMethodList).map((item) => item.body);

    return arr;
  };

  let allPercentStr = '';
  Object.values(payMethodList).forEach((item, index, arr) => {
    if (item.percent) {
      allPercentStr = allPercentStr + item.percent + '%';

      if (index !== arr.length - 1) {
        allPercentStr = allPercentStr + ',';
      }
    }
  });

  return {
    payMethodList,
    addMethod,
    resetMethodList,
    getMethodBodyArr,
    allPercentStr,
  };
}; // usePayMethod
