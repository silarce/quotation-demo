import classNames from 'classnames';

// antd
import { Popover, PopoverProps } from 'antd';

// icon
import { Icon_info } from 'public/image/icon/svgComponent/svgIcons';

import scss from './tip.module.scss';

type TtipProps = Omit<PopoverProps, 'children'> & {
  className_icon?: string;
};

//
export default function Tip(props: TtipProps) {
  const { className, className_icon, ...popOverProps } = props;

  return (
    <Popover
      //
      trigger="hover"
      {...popOverProps}
      className={classNames(scss.tip, className)}
    >
      {/* 必須用元素包覆trigger才能觸發 */}
      <span>
        <Icon_info className={className_icon} />
      </span>
    </Popover>
  );
}
