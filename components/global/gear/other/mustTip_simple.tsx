import classNames from 'classnames';
import Image from 'next/image';

// icon
import iconMust from 'public/image/icon/asterisk.svg?url';

import scss from './mustTip_simple.module.scss';

export default function MustTip_simple({ className, preStyle }: { className?: string; preStyle?: 'minimal' }) {
  const theClassName = classNames(scss.mustTip, { [scss.minimal]: preStyle === 'minimal' }, className);

  return (
    <div className={theClassName}>
      <Image src={iconMust} alt="必填" />
    </div>
  );
}
