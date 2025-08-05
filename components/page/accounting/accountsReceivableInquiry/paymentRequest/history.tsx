import classNames from 'classnames';
import { DataEntry_fong } from 'components/global/gear/dataEntry';
import { Collapse } from 'components/global/myAntd/collapse';

const History = () => {
  return (
    <div>
      <div className="text-xl font-semibold mb-6">請款紀錄</div>
      <Collapse
        items={[
          {
            key: '1',
            label: '第O2期請款-OO 第O1期',
            children: <HistoryDetail />,
          },
          {
            key: '2',
            label: '第O2期請款-OO 第O1期',
            children: <HistoryDetail />,
          },
        ]}
      />
    </div>
  );
};

const HistoryDetail = () => {
  return (
    <div className={classNames('grid grid-cols-4 gap-fong ')}>
      <DataEntry_fong caption="本期請款金額" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="營業稅(5%)" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="本期合計" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="保留款(%)" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="稅" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="保留款金額" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="金額總計" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票日期" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票號碼" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票金額" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="買受人" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="統一編號" disabled={true}>
        foooo
      </DataEntry_fong>
    </div>
  );
};

export default History;
