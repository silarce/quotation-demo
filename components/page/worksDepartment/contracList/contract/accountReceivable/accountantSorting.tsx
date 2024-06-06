import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

// gear
import TopBar from './ui/topBar';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './accountantSorting.module.scss';

// ================================================================================

type Tinvoice = {
  id: string;

  invoiceNumber: React.ReactNode;
  invoiceDate: React.ReactNode;
  price: React.ReactNode;
};

type Taccountant = {
  id: string;

  insertDate: React.ReactNode;
  importAccountingNumber: React.ReactNode;
  noteMaturityDate: React.ReactNode; // 票據到期日
  price: React.ReactNode;
};

type Tstate = {
  invoice: Tinvoice;
  accountantArr: Taccountant[];
};

// ================================================================================
// region START
export default function AccountantSorting({ className }: { className?: string }) {
  // -----------------------------------------------------------------------------
  // region RENDER

  return (
    <div className={classNames(scss.accountantSorting, className)}>
      <TopBar caption="應收帳款管理">
        <MyButton_v2 px="px22" py="py4">
          新增折讓
        </MyButton_v2>
      </TopBar>
      <div className={scss.table}>
        <Group className={classNames(scss.top)}>
          <Left>發票開立資訊</Left>
          <Right>已收款項明細</Right>
        </Group>
        {/*  */}
        <Group className={scss['thead']}>
          <Left>
            <Row>
              <span>發票號碼</span>
              <span>開立日期</span>
              <span>開立金額</span>
            </Row>
          </Left>
          <Right>
            <Row>
              <span>收款日期</span>
              <span>帳號/號碼</span>
              <span>到期日</span>
              <span>收款金額</span>
            </Row>
          </Right>
        </Group>
        {/*  */}

        {fakeStateArr.map((state) => {
          const { invoice, accountantArr } = state;
          const { id, invoiceNumber, invoiceDate, price } = invoice;

          return (
            <Group key={id} className={scss['tbody']}>
              <Left>
                <Row>
                  <span>{invoiceNumber}</span>
                  <span>{invoiceDate}</span>
                  <span>{price}</span>
                </Row>
              </Left>
              <Right>
                {accountantArr.map((accountant) => {
                  const {
                    //
                    id,
                    insertDate,
                    importAccountingNumber,
                    noteMaturityDate,
                    price,
                  } = accountant;

                  return (
                    <Row key={id}>
                      <span>{insertDate}</span>
                      <span>{importAccountingNumber}</span>
                      <span>{noteMaturityDate}</span>
                      <span>{price}</span>
                    </Row>
                  );
                })}
              </Right>
            </Group>
          );
        })}

        <Group className={scss['total']}>
          <Left>
            <Row>
              <span></span>
              <span>合計</span>
              <span>20000</span>
            </Row>
          </Left>
          <Right>
            <Row>
              <span></span>
              <span></span>
              <span>合計</span>
              <span>50000</span>
            </Row>
          </Right>
        </Group>

        <div className={scss.footCaption}>已開立發票未收款項</div>

        <Group className={scss['total']}>
          <Left>
            <Row>
              <span></span>
              <span>合計</span>
              <span>20000</span>
            </Row>
          </Left>
          <Right>
            <Row>
              <span></span>
              <span></span>
              <span>合計</span>
              <span>50000</span>
            </Row>
          </Right>
        </Group>
      </div>
    </div>
  );
}

// region END

// ================================================================================

// region COMPONENT

const Group = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.group, className)}>{children}</div>;
};

const Left = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.left, className)}>{children}</div>;
};

const Right = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.right, className)}>{children}</div>;
};

const Row = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={classNames(scss.row, className)}>{children}</div>;
};

// ================================================================================

// region fake data
// length ===3
// id is random
const fakeStateArr: Tstate[] = [
  {
    invoice: {
      id: 'i-fdsagasdgas',
      invoiceNumber: 'A123456',
      invoiceDate: '2021/01/01',
      price: '1000',
    },
    accountantArr: [
      {
        id: 'a-sdfasfasd',
        insertDate: '2021/01/01',
        importAccountingNumber: 'A123456',
        noteMaturityDate: '2021/01/01',
        price: '1000',
      },
    ],
  },
  {
    invoice: {
      id: 'i-fsdfsdbdgefd',
      invoiceNumber: 'A123456',
      invoiceDate: '2021/01/01',
      price: '1000',
    },
    accountantArr: [
      {
        id: 'a-ghhghsd',
        insertDate: '2021/01/01',
        importAccountingNumber: 'A123456',
        noteMaturityDate: '2021/01/01',
        price: '1000',
      },
      {
        id: 'a-dsdghsdf',
        insertDate: '2021/01/01',
        importAccountingNumber: 'A123456',
        noteMaturityDate: '2021/01/01',
        price: '1000',
      },
    ],
  },
  {
    invoice: {
      id: 'i-gjdfgbndfghtr',
      invoiceNumber: 'A123456',
      invoiceDate: '2021/01/01',
      price: '1000',
    },
    accountantArr: [
      {
        id: 'a-gsdfhfghe',
        insertDate: '2021/01/01',
        importAccountingNumber: 'A123456',
        noteMaturityDate: '2021/01/01',
        price: '1000',
      },
      {
        id: 'a-gdfgsdfgsdjfyjkdfg',
        insertDate: '2021/01/01',
        importAccountingNumber: 'A123456',
        noteMaturityDate: '2021/01/01',
        price: '1000',
      },
      {
        id: 'a-gdsfytyiygds',
        insertDate: '2021/01/01',
        importAccountingNumber: 'A123456',
        noteMaturityDate: '2021/01/01',
        price: '1000',
      },
    ],
  },
];
