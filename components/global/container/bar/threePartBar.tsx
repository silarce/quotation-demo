import React from 'react';

import classNames from 'classnames';

import scss from './threePartBar.module.scss';

const ThreePartBar = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [firstChild, secondChild, thirdChild, ...restChildren] = React.Children.toArray(children);

  return (
    <div className={classNames(scss.btnBar, className)}>
      <div className="flex gap-1">{firstChild}</div>
      <div className="flex gap-1">{secondChild}</div>
      <div className="flex gap-1">{thirdChild}</div>
    </div>
  );
};

export default ThreePartBar;
