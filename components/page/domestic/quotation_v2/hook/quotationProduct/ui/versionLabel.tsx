const VersionLabel = ({
  version,
  subTotal,
  salesTax,
  total,
}: {
  version: React.ReactNode;
  subTotal: React.ReactNode;
  salesTax: React.ReactNode;
  total: React.ReactNode;
}) => {
  return (
    <div className="ml-2 mb-1 mt-auto">
      <div>版本 : {version}</div>
      <div>
        小計 : {subTotal}　 營業稅: {salesTax}　 總計 : {total}
        {/*  */}
      </div>
    </div>
  );
};

export default VersionLabel;
