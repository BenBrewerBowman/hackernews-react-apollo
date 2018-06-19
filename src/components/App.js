import React from 'react';
import LinkList from './LinkList';
import CreateLink from './CreateLink';


class App extends React.Component {
  render() {
    return (
      <div>
        <LinkList />
        <CreateLink />
      </div>
    );
  }
}

export default App;
