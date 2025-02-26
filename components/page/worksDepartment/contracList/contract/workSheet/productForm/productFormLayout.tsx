import scss from './productFormLayout.module.scss';

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className={scss.productForm}>{children}</div>;
};

const Section = ({ children }: { children: React.ReactNode }) => {
  return <p className={'mb-8 text-main text-xl font-bold'}>{children}</p>;
};

const MainFormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className={scss.mainFormWrapper}>{children}</div>;
};

const FormGrid = ({ children }: { children: React.ReactNode }) => {
  return <div className={scss.formGrid}>{children}</div>;
};

export { Container, Section, MainFormWrapper, FormGrid };
