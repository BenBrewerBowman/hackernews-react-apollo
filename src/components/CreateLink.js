import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FEED_QUERY } from './LinkList'


class CreateLink extends React.Component {

  state = {
    description: '',
    url: ''
  }

  _createLink = async () => {
    const { description, url} = this.state;
    await this.props.postMutation({
      variables: {
        description,
        url
      },
      update: (store, { data: { post } }) => {
        const data = store.readQuery({ query: FEED_QUERY });
        data.feed.links.sprice(0, 0, post);
        store.writeQuery({
          query: FEED_QUERY,
          data
        });
      }
    });
    // redirect to new news after posting an article
    this.props.history.push('/');
  }

  render() {
    const { description, url } = this.state;

    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="A URL for the link"
          />
        </div>
        <button onClick={() => this._createLink()}>
          Submit
        </button>
      </div>
    );
  }
}


const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

export default graphql(POST_MUTATION, { name: 'postMutation' }) (CreateLink);
