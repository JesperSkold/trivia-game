import React from 'react';
import Settings from '../components/Settings';
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import CategoryList from '../components/CategoryList';
import Game from '../components/Game';
import styles from './style.module.scss'
function App() {
  const {
    step
  } = useSelector((state: RootState) => state.game)

  return (
    <div className={styles.app}>
      {step === 0 && <CategoryList />}
      {step === 1 && <Settings />}
      {step === 2 && <Game />}
    </div>
  );
}

export default App;
