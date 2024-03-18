import classNames from 'classnames';
import Image from 'next/image';

// icon
import iconReview from 'public/image/icon/review.svg';

// css
import scss from './signatureBar_v2.module.scss';

// =======================================================================

type Titem = {
  label: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  iconWrapperClassName?: string;
  isReviewed?: boolean;
  onClick?: () => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

type Tcontrol = {
  signatureArr: Titem[];
  onClick?: () => void;
};

export type { Tcontrol as Tcontrol_signatureBar, Titem as TsignatureBarItem };

// =======================================================================
export default function SignatureBar({
  control,
  className,
  style,
  disabled,
}: {
  control: Tcontrol;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const { signatureArr, onClick } = control;

  return (
    <div className={classNames(scss.signatureBar, className)} style={style} onClick={onClick}>
      {signatureArr.map((item, index) => {
        const { label, value, icon, iconWrapperClassName, className, style, isReviewed, onClick } = item;
        let { inputProps } = item;

        if (inputProps) {
          inputProps = {
            readOnly: disabled,
            ...inputProps,
          };
        }

        let showBorderBottom = false;

        if (inputProps) {
          !disabled && (showBorderBottom = true);
        } else if (!value) {
          showBorderBottom = true;
        }

        return (
          <div
            key={index}
            className={classNames(scss.box, className, showBorderBottom && scss.noValue, scss.plus)}
            style={style}
            onClick={onClick}
          >
            <p className={scss.label}>{label}</p>
            <div className={scss.signature}>
              {inputProps && <input type="text" className={scss.text} {...inputProps} />}
              {!inputProps && <span className={scss.text}>{value}</span>}
              <div className={classNames(scss.iconWrapper, iconWrapperClassName)}>
                {icon !== undefined && icon}
                {icon === undefined && isReviewed && <Image src={iconReview} alt="已審核" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =========================================================================
