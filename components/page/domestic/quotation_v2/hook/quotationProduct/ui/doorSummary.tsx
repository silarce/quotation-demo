import scss from './doorSummary.module.scss';

type Tprops = {
  list: {
    doorModel: React.ReactNode;
    quantity: React.ReactNode;
    avgDiscount: React.ReactNode;
  }[];
};

const DoorSummary = ({ list }: Tprops) => {
  return (
    <ul>
      {list.map(({ doorModel, quantity, avgDiscount }, index) => {
        return (
          <li key={index} className={scss.li}>
            <span>{doorModel}</span>
            <span className={scss.qty}>{quantity}樘</span>
            <span>平均折數：{avgDiscount}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default DoorSummary;
