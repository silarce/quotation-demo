import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';
import Tab from 'components/global/gear/button/tab';

import Icon_note from 'public/image/icon/fong/note.svg';

import scss from './salesInformation.module.scss';

export default function SalesInformation() {
  return (
    <div>
      <div className="pageTop">
        <div className="flex gap-4">
          <Tab>銷貨資料</Tab>
          <Tab>應收帳款</Tab>
        </div>
      </div>
    </div>
  );
}
