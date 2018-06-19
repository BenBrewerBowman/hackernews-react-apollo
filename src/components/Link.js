import React from 'react';


class Link extends React.Component {
  render() {
    const { description, url } = this.props.link;

    return (
      <div>
        <div>
          {description} ({url})
        </div>
      </div>
    );
  }
}

export { Link }