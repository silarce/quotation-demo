import Link from 'next/link';
import Router from 'next/router';

export default function Approval() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div>
      <div>LIST</div>
      <div>LIST</div>
      <div>LIST</div>
      <div>LIST</div>
      <div>LIST</div>
      <div>LIST</div>
      <div>LIST</div>
      <div>LIST</div>

      <Link href={`${Router.pathname}/approve`}>go to approve</Link>
    </div>
  );
}
