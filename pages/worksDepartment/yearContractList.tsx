import moment from 'moment';
import _ from 'lodash';

// global gear
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './yearContractList.module.scss';

export default function YearContractList({ rwd1439 }: { rwd1439: boolean }) {
  const thisYear = moment().format('YYYY');
  const thisYear_num = Number(thisYear);
  const oldestYear = 2000;

  const threeYearArr = [thisYear_num, thisYear_num - 1, thisYear_num - 2];

  const years = [];

  for (let year = thisYear_num - 3; year >= oldestYear; year--) {
    years.push(year);
  }

  const arrLength = rwd1439 ? 5 : 7;

  const yearArrArr = _.chunk(years, arrLength);

  return (
    <SubLayer>
      <PageHeader02 tag="合約_年度" />
      <div className={scss.main}>
        <div className={scss.threeYear}>
          <div className={scss.thead}>
            {threeYearArr.map((year, index) => {
              return (
                <div key={index} style={config.threeYear.style}>
                  <span>{year - 1911}</span>
                </div>
              );
            })}
          </div>

          <div className={scss.tbody}>
            {threeYearArr.map((year, index) => {
              const href = `/worksDepartment/yearContractList/contractList_year?year=${year}`;

              return (
                <div key={index} style={config.threeYear.style} className={scss.tbodyCell}>
                  <div>
                    <MyButton_v2 label="已做" href={href + '&isDone=true'} />
                  </div>
                  <div>
                    <MyButton_v2 label="未做" href={href + '&isDone=false'} />
                  </div>
                </div>
              );
            })}
          </div>

          <div></div>
        </div>

        {/*  */}
        <div className={scss.otherYear}>
          {/* row */}

          {yearArrArr.map((yearArr, pIndex) => {
            return (
              <div className={scss.row} key={pIndex}>
                <div className={scss.thead}>
                  {yearArr.map((year, index) => {
                    return (
                      <div key={index} style={config.otherYear.style}>
                        <span>{year - 1911}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={scss.tbody}>
                  {yearArr.map((year, index) => {
                    const href = `/worksDepartment/yearContractList/contractList_year?year=${year}`;

                    return (
                      <div key={index} style={config.otherYear.style}>
                        <MyButton_v2 label="合約列表" href={href} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SubLayer>
  );
}

// ==============================================================================

const config = {
  threeYear: {
    style: {
      width: '207px',
    },
  },
  otherYear: {
    style: {
      width: '100px',
    },
  },
};
