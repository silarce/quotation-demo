import React from 'react';

// component
import PageHeader from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// css
import style from './contract.module.scss';

export default function WorkSheet() {
  return (
    <div className={style.container}>
      <PageHeader />
      <div className={style.mainContainer}>
        <div className={style.workContactDoc}>
          <h1>工作表</h1>
          <h1>工作表</h1>
          <h1>工作表</h1>
          <h1>工作表</h1>
          <h1>工作表</h1>
        </div>
      </div>
    </div>
  );
}
