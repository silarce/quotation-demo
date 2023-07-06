import { useEffect } from 'react';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import styles from '../../styles/index.module.scss';

import InputSel from 'components/global/gear/inputAndSel/inputSel';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/home/dailyReport?isMine=true');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.foo}>
        <h1>首頁</h1>
      </div>
    </div>
  );
};

export default Home;
