import './assets/styles/main.scss'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from './cmps/Header';
import { Doc } from './pages/Doc';

export const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/doc" component={Doc} />
      </Switch>
    </Router>
  );
}

