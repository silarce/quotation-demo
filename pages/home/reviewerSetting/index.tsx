import { useState } from 'react';

import classNames from 'classnames';

// layer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// gear
import SearchBar from 'components/global/gear/inputAndSel_v2/searchBar/searchBar';
import CellWithBar from 'components/global/gear/cell/cellWithBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// icon
import { IconDelete01, IconEdit } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

export default function SetReviewer() {
  const [showModal, setShowModal] = useState(false);

  const showEmployeeSelector = () => {
    setShowModal(true);
  };

  const closeEmployeeSelector = () => {
    setShowModal(false);
  };

  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      custom: (
        <SearchBar
          inputSelPropsArr={[
            {
              wrapperStyle: { width: '100px' },
              inputProps: {
                props: {
                  placeholder: '搜尋內容',
                },
              },
            },
          ]}
          onClick={() => {}}
        />
      ),
    },
    {
      type: 'addButton',
      label: '新增回報人員',
      onClick: showEmployeeSelector,
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="審核設定" panelList={panelList} />
      <div className={scss.main}>
        <Thead />
        <div>
          <Row showEmployeeSelector={showEmployeeSelector} />
          <Row02 showEmployeeSelector={showEmployeeSelector} />
          <Row02 showEmployeeSelector={showEmployeeSelector} />
          <Row02 showEmployeeSelector={showEmployeeSelector} />
          <Row02 showEmployeeSelector={showEmployeeSelector} />
          <Row02 showEmployeeSelector={showEmployeeSelector} />
          <Row02 showEmployeeSelector={showEmployeeSelector} />
        </div>
      </div>
      <EmployeeSelector showModal={showModal} onConfirm={() => {}} onCancel={closeEmployeeSelector} />
    </SubLayer>
  );
}

// ==========================================================

const Thead = () => {
  return (
    <div className={scss.thead}>
      <div>
        <span>回報人員</span>
      </div>
      <div>
        <span>審核人員</span>
      </div>
      <div>
        <span>檢視人員</span>
      </div>
      <div></div>
    </div>
  );
};

const Row = ({ showEmployeeSelector }: { showEmployeeSelector: () => void }) => {
  return (
    <CellWithBar className={scss.row}>
      <div>
        <span>王小明</span>
      </div>
      <div>
        <MyButton_v2 onClick={showEmployeeSelector} preImg="add" label="新增審核人員" />
      </div>
      <div>
        <MyButton_v2 onClick={showEmployeeSelector} preImg="add" label="新增檢視人員" />
      </div>
      <div>
        <IconDelete01
          onClick={() => {
            myAlert.confirm({ title: '確定刪除?' });
          }}
        />
      </div>
    </CellWithBar>
  );
};

const Row02 = ({ showEmployeeSelector }: { showEmployeeSelector: () => void }) => {
  return (
    <CellWithBar className={scss.row}>
      <div>
        <span>王小明</span>
      </div>
      {/*  */}
      <div>
        <div className={scss.nameListContainer}>
          <div className={scss.list}>
            {nameArr.map((name, index) => {
              return <span key={index}>{name}</span>;
            })}
          </div>

          <IconEdit onClick={showEmployeeSelector} className={scss.edit} />
        </div>
      </div>
      {/*  */}
      <div>
        <div className={scss.nameListContainer}>
          <div className={scss.list}>
            {nameArr.map((name, index) => {
              return <span key={index}>{name}</span>;
            })}
          </div>

          <IconEdit onClick={showEmployeeSelector} className={scss.edit} />
        </div>
      </div>
      {/*  */}
      <div>
        <IconDelete01
          onClick={() => {
            myAlert.confirm({ title: '確定刪除?' });
          }}
        />
      </div>
    </CellWithBar>
  );
};

const nameArr = [
  '曾剛玉',
  '謝艾廷',
  '景雅冠',
  '吳羽燕',
  '左孟盈',
  '蔣位偲',
  '曆文欣',
  '曹毅怡',
  '龔詠',
  '簡娟容',
  '鍾珊春',
  '趙薇依',
  '吳廷嘉',
  '馬長人',
  '馬芳辰',
  '曾剛玉',
  '謝艾廷',
  '景雅冠',
  '吳羽燕',
  '左孟盈',
  '蔣位偲',
  '曆文欣',
  '曹毅怡',
  '龔詠',
  '簡娟容',
  '鍾珊春',
  '趙薇依',
  '吳廷嘉',
  '馬長人',
  '馬芳辰',
];
