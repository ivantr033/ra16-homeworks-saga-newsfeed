import { Provider } from 'react-redux';
import { store } from './store';
import { NewsFeed } from './components/NewsFeed';
import './App.css';

export default function App() {
  return (
    <Provider store={store}>
      <NewsFeed />
    </Provider>
  );
}
