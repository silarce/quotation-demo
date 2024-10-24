import { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type { TuserDto } from 'js/api/dtoTypes';

import { useTranslation } from 'react-i18next';

import scss from './index.module.scss';

// ================================================================================

// ================================================================================

// MARK: START
export default function AccountsPayableDetailList() {
  // MARK: DATA
  // MARK: API
  // MARK: HANDLE
  // MARK: useEffect

  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02 tag="應收帳款明細" />

      <div>
        <Spin spinning={false} delay={300}>
          <h1>fooo</h1>
        </Spin>
      </div>
    </SubLayer>
  );
}
// MARK: END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
