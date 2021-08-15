import './assets/styles/main.scss'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from './cmps/Header';

export const App = () => {
  return (
    <Router>
      <Header />
      <Switch>

      </Switch>
    </Router>
  );
}

