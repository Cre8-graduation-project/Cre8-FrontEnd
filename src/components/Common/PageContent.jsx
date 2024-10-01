import classes from './PageContent.module.css';

export default function PageContent({ title, extraClass, children }) {
  return (
    <div className={`${classes.content} ${extraClass}`}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}