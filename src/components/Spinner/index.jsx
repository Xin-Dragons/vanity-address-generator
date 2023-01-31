import classnames from 'classnames';
import styles from './style.module.scss';

export const Spinner = ({ className, small }) => {
  return <div className={classnames(styles.spinner, className, { [styles.small]: small })} />
}

export default Spinner;