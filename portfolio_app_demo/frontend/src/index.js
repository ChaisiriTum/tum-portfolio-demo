
import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard';
import './styles.css';

function App(){
  return <div className="app"><Dashboard/></div>;
}
ReactDOM.render(<App />, document.getElementById('root'));
