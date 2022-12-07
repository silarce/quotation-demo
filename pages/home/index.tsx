
import type { NextPage } from 'next'
import styles from '../../styles/index.module.scss'


import InputSel from 'components/global/gear/inputAndSel/inputSel'


const Home: NextPage = () => {



  return (
    <div className={styles.container}>
      <div className={styles.foo}>
        <h1>首頁</h1>


        <div style={{
          width: "400px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "50px"
        }}>
          <InputSel
            label="ABC"
            placeholder='測試測試測試測試'
            inputProps={
              {
                value: "2222",
                onChange: (value: string) => { },
              }
            }
          />
          <InputSel
            label="ABC"
            placeholder='測試'
            selectProps={
              {
                value: { label: "AA", value: "aa" },
                // value: undefined,
                options: fooArr,
                onChange: (a) => { console.log(a?.value) },
              }
            }
          />
        </div>


      </div>
    </div>
  )
}

export default Home



const fooArr = [
  { label: "AAA", value: "aaa" },
  { label: "BBB", value: "bbb" },
  { label: "CCC", value: "ccc" },
]


