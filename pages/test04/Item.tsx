import React, { forwardRef } from 'react';


export const Item = forwardRef((
  { id, ...props }, ref
) => {


  console.log(id)
  return (
    <div {...props} ref={ref}>{id}</div>
  )
}); 