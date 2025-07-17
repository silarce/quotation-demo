import classNames from 'classnames';

import scss from './index.module.scss';

import Tab from 'components/global/gear/button/tab';

export default function AccountsReceivableInquiry() {
  return (
    <div>
      <Top className={'pageTop'}>
        <div className="p-5 flex gap-10">
          <Tab>TAB 01</Tab>
          <Tab>TAB 02</Tab>
          <Tab>TAB 03</Tab>
        </div>
      </Top>
      <div className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatibus quis nihil quibusdam distinctio
        vero labore expedita a fugiat, sed numquam esse asperiores culpa autem minima vitae ratione nam eum!
      </div>
      <div className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatibus quis nihil quibusdam distinctio
        vero labore expedita a fugiat, sed numquam esse asperiores culpa autem minima vitae ratione nam eum!
      </div>
      <div className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatibus quis nihil quibusdam distinctio
        vero labore expedita a fugiat, sed numquam esse asperiores culpa autem minima vitae ratione nam eum!
      </div>
      <div className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatibus quis nihil quibusdam distinctio
        vero labore expedita a fugiat, sed numquam esse asperiores culpa autem minima vitae ratione nam eum!
      </div>
      <div className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatibus quis nihil quibusdam distinctio
        vero labore expedita a fugiat, sed numquam esse asperiores culpa autem minima vitae ratione nam eum!
      </div>
      <div className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatibus quis nihil quibusdam distinctio
        vero labore expedita a fugiat, sed numquam esse asperiores culpa autem minima vitae ratione nam eum!
      </div>
      <div className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatibus quis nihil quibusdam distinctio
        vero labore expedita a fugiat, sed numquam esse asperiores culpa autem minima vitae ratione nam eum!
      </div>
      <div className="text-5xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatibus quis nihil quibusdam distinctio
        vero labore expedita a fugiat, sed numquam esse asperiores culpa autem minima vitae ratione nam eum!
      </div>
    </div>
  );
}

// ========================================================================

const Top = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classNames(scss.top, className)} {...props} />
);

// const TopContainer = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;
