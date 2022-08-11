
// css
import style from "./columnTitle.module.scss"




interface Tdata {
  label: string
  list: { label?: string }[]
}


export default function ColumnList({ data }: { data: Tdata }) {

  const { label, list } = data



  return (
    <div className={style.container}>
      {/*  */}
      <div className={style.title}>
        <div>
          <span>{label}</span>
        </div>
      </div>
      {/*  */}
      <ul className={style.list}>
        {list.map((item, index) => {
          const { label } = item
          return (
            <li key={index}>
              <div>
                <span>{label}</span>
              </div>
            </li>
          )
        })}
      </ul>
      {/*  */}
    </div>
  )
}


