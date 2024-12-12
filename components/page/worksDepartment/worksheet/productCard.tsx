import classNames from 'classnames';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import StatusLabel, { TstatusLabelProps } from 'components/global/gear/button/statusLabel';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './productCard.module.scss';

// =================================================================

type TworksheetIntro = {
  worksheetId: string | undefined;
  itemName: string | undefined;
  doorModelName: string | undefined;
  width: string | undefined;
  height: string | undefined;
  qty: string | undefined;
  isActive?: boolean;
  reviewStatus: TstatusLabelProps;
  onClick: (e: React.MouseEvent) => void;
  onDeleteClick?: () => void;
};

type Tcontrol = {
  itemName: string;
  doorModelName: string;
  qty: string;
  width: string;
  height: string;
  onSeparateClick?: (e: React.MouseEvent) => void;
  worksheetIntroArr: TworksheetIntro[];

  isSpecialDoor: boolean | undefined;
};

export type { Tcontrol as Tcontrol_productCard, TworksheetIntro };

// =================================================================
export default function ProductCard({ control }: { control: Tcontrol }) {
  return (
    <div className={classNames(scss.card)}>
      <div className={scss.info}>
        <div className={scss.left}>
          <span>{control.itemName}</span>
          <span>{control.doorModelName}</span>
          <span>數量 : {control.qty}樘</span>
          <button
            className={classNames(
              scss.btn,
              control.isSpecialDoor && 'invisible',
              control.isSpecialDoor === undefined && 'invisible',
              !control.onSeparateClick && 'invisible'
            )}
            onClick={control.onSeparateClick}
          >
            分堆
          </button>
        </div>
        {/*  */}
        <div className={scss.right}>
          <div>
            <div className={scss.height}>
              <div>{control.height}</div>
            </div>
            <DoorIcon className={scss.doorIcon} />
          </div>
          <div>
            <div className={scss.width}>
              <div>{control.width}</div>
            </div>
          </div>
        </div>
        {/*  */}
      </div>

      <div className={classNames(scss.worksheetList)}>
        {control.worksheetIntroArr.map((worksheet) => {
          const {
            //
            worksheetId: id,
            itemName,
            doorModelName,
            width,
            height,
            qty,
            isActive,
            reviewStatus,
            onClick,
            onDeleteClick,
          } = worksheet;

          return (
            <CellWithBar key={id} isActive={isActive} className={scss.worksheetWrapper}>
              <div className={scss.worksheet} onClick={onClick}>
                <p>{itemName}</p>
                <p className="mt-2">{doorModelName}</p>
                <div className={scss.info}>
                  <div>
                    <span>{`全寬(L):${width}`}</span>
                    <br />
                    <span>{`淨高(h):${height}`}</span>
                  </div>
                  <span>{qty}樘</span>
                  {onDeleteClick && <IconDelete01 onClick={onDeleteClick} />}
                </div>

                <StatusLabel
                  {...reviewStatus}
                  className={classNames(scss.statusLabel, 'mt-2', reviewStatus.className)}
                />
              </div>
            </CellWithBar>
          );
        })}
      </div>
    </div>
  );
}

// =================================================================
// =================================================================
// =================================================================

const DoorIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="44" height="54" viewBox="0 0 44 54" fill="none">
      <path
        d="M20.8005 0L1.15371 1.53024e-05C0.810609 0.27901 0.519271 0.731208 0.314627 1.30218C0.109983 1.87315 0.000784885 2.53878 0 3.21926V52.2313C0 52.7004 0.103089 53.1503 0.286458 53.482C0.469827 53.8137 0.718455 54 0.977778 54H6.84444V7H37.1556V54H43.0222C43.2815 54 43.5302 53.8137 43.7135 53.482C43.8969 53.1503 44 52.7004 44 52.2313V3.21926C43.9992 2.53878 43.89 1.87315 43.6854 1.30218C43.4807 0.731208 43.1894 0.27901 42.8463 1.53024e-05L24 1.8315e-05C22.2344 3.69767e-05 22.2764 0 22 0C21.7236 0 22 1.50573e-05 20.8005 0Z"
        fill="#14256A"
      />
      <path
        d="M33.04 32H10.96C10.4298 32 10 32.4477 10 33V36C10 36.5523 10.4298 37 10.96 37H33.04C33.5702 37 34 36.5523 34 36V33C34 32.4477 33.5702 32 33.04 32Z"
        fill="#14256A"
      />
      <path
        d="M33.04 24H10.96C10.4298 24 10 24.4477 10 25V28C10 28.5523 10.4298 29 10.96 29H33.04C33.5702 29 34 28.5523 34 28V25C34 24.4477 33.5702 24 33.04 24Z"
        fill="#14256A"
      />
      <path
        d="M33.04 16H10.96C10.4298 16 10 16.4477 10 17V20C10 20.5523 10.4298 21 10.96 21H33.04C33.5702 21 34 20.5523 34 20V17C34 16.4477 33.5702 16 33.04 16Z"
        fill="#14256A"
      />
      <path
        d="M33.04 8H10.96C10.4298 8 10 8.44772 10 9V12C10 12.5523 10.4298 13 10.96 13H33.04C33.5702 13 34 12.5523 34 12V9C34 8.44772 33.5702 8 33.04 8Z"
        fill="#14256A"
      />
      <path
        d="M33.04 40H10.96C10.4298 40 10 40.4477 10 41V44C10 44.5523 10.4298 45 10.96 45H33.04C33.5702 45 34 44.5523 34 44V41C34 40.4477 33.5702 40 33.04 40Z"
        fill="#14256A"
      />
      <path
        d="M33.04 48H10.96C10.4298 48 10 48.5373 10 49.2V52.8C10 53.4627 10.4298 54 10.96 54H33.04C33.5702 54 34 53.4627 34 52.8V49.2C34 48.5373 33.5702 48 33.04 48Z"
        fill="#14256A"
      />
    </svg>
  );
};
