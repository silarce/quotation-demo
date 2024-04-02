import React from 'react';

export interface TableContentWithImageProps {
  value?: string;
  label?: string;
  label2?: string;
  image?: string;
  height?: number;
  dangerSvg?: string;
}

export const TableContentWithImage2 = ({
  value,
  label,
  label2,
  image,
  height = 69,
  dangerSvg,
}: TableContentWithImageProps) => {
  return (
    <div className="h-20 flex items-center border-t border-black" style={{ height: height }}>
      <div className="flex-1 h-20 flex items-center border-r border-black px-1" style={{ height: height }}>
        <div style={{ display: 'block' }}>
          <div className="text-center">{label}</div>
          <div className="text-center">{label2}</div>
        </div>
      </div>

      {/* <div className="flex-1 px-2">{value}</div> */}

      <div className="flex-1 px-1 flex items-center space-x-1">
        {dangerSvg && (
          // eslint-disable-next-line @next/next/no-img-element
          // <img
          //   // dangerouslySetInnerHTML={{ __html: image }}
          //   src={image}
          //   // className="w-10 h-10"
          //   width={90}
          //   height={90}
          //   alt=""
          // />
          <div dangerouslySetInnerHTML={{ __html: dangerSvg }} style={{ width: 75, height: 75 }} />
        )}

        {value === '客製' && <div>{value}</div>}
      </div>
    </div>
  );
};
