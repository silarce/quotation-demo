import { useState } from 'react';

import classNames from 'classnames';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// css
import scss from './memorandum.module.scss';

// ============================================================================

type TtabState = 'all' | 'recived' | 'sent';

// ============================================================================
export default function Memorandum() {
  const [tabState, setTabState] = useState<TtabState>('all');

  // ---------------------------------------------------------------------------

  const tabArr: Ttab[] = [
    {
      label: '全部公文',
      isActive: tabState === 'all',
      onClick: () => {
        setTabState('all');
      },
    },
    {
      label: '收信匣',
      isActive: tabState === 'recived',

      onClick: () => {
        setTabState('recived');
      },
    },
    {
      label: '寄信匣',
      isActive: tabState === 'sent',
      onClick: () => {
        setTabState('sent');
      },
    },
  ];

  // ---------------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '新增',
      onClick: () => {},
    },
  ];

  // ---------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader contractNumber={'foooo'} panelList={panelList} />
      <div>
        <h1>備忘錄</h1>

        <Wrapper_tab className={'m-auto'} tabArr={tabArr}>
          <p>fooooo</p>
          <p>fooooo</p>
          <p>fooooo</p>
          <p>fooooo</p>
          <p>fooooo</p>
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}

// ============================================================================

type Ttab = {
  label: string;
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Wrapper_tab = ({
  tabArr = [],
  children,
  className,
  childrenOption,
}: {
  tabArr?: Ttab[];
  children?: React.ReactNode;
  className?: string;
  childrenOption?: {
    noBorder?: boolean;
    noBorderTop?: boolean;
  };
}) => {
  return (
    <div className={classNames(scss.wrapper_tab, className)}>
      <div className={scss.stickyCover} />
      {/*  */}

      <div className={classNames(scss.tabBar)}>
        {tabArr.map((tab, index) => {
          const { label, isActive, className, style, onClick } = tab;

          return (
            <div
              key={index}
              className={classNames(scss.tab, isActive && scss.active, className)}
              style={style}
              onClick={onClick}
            >
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/*  */}
      <div
        className={classNames(
          scss.childrenContainer,
          childrenOption?.noBorder && scss.noBorder,
          childrenOption?.noBorderTop && scss.notBorderTop
        )}
      >
        {children}
      </div>
    </div>
  );
};
