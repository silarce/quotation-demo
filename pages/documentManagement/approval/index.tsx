import Link from 'next/link';
import Router from 'next/router';

export default function Approval() {
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
