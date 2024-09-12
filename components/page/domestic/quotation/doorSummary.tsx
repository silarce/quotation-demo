import scss from './doorSummary.module.scss';

const DoorSummary = ({ doorModelSummary }: { doorModelSummary: [string, string, string][] }) => {
  return (
    <ul>
      {doorModelSummary.map((arr, index) => {
        return (
          <li key={index} className={scss.li}>
            <span>{arr[0]}</span>
            <span className={scss.qty}>{arr[1]}</span>
            <span>{arr[2]}</span>
          </li>
        );
      })}
    </ul>
  );
};

// doorModelSummary:`${theKey}_${theQty}樘_平均折數: ${item.avgDiscount}\n${theKey}_${theQty}樘_平均折數: ${item.avgDiscount}\n${theKey}_${theQty}樘_平均折數: ${item.avgDiscount}\n`
DoorSummary.format = (doorModelSummary: string) => {
  return doorModelSummary.split('\n').map((str) => str.split('_') as [string, string, string]);
};

export default DoorSummary;
