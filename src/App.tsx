import React from 'react';
import Settings from './components/Settings';
import { useSelector } from 'react-redux'
import { RootState } from './app/store'
import CategoryList from './components/CategoryList';
import Game from './components/Game';

function App() {
  const {
    step
  } = useSelector((state: RootState) => state.game)

  return (
    <div className="App">
      {step === 0 && <CategoryList />}
      {step === 1 && <Settings />}
      {step === 2 && <Game />}
    </div>
  );
}

export default App;
