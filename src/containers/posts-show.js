import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {Link } from 'react-router';
import PureComponent from '../components/pure-component';
import { getPost, emptyPost, deletePost } from '../actions/index';
import Loading from '../components/loading';


class PostsForm extends PureComponent {

  // Check through all of PostsNew's parents for the property router
  // and assign it to this.context.router
  static contextTypes = {
    router: PropTypes.object
  };


  componentWillMount() {
    this.props.emptyPost();
    this.props.getPost(this.props.params.id);
  }


  onClickDelete(event) {
    event.preventDefault();

    if(confirm('Are you sure?')) {
      this.props.deletePost(this.props.params.id)
        .then(() => this.context.router.push('/') );
    }
  }


  render() {
    if(!this.props.post) {
      return (<Loading />);
    }

    const {id, title, categories, content} = this.props.post;

    return (
      <div>
        <div className="text-xs-right">
          <Link to={`/posts/edit/${id}`}
                className="btn btn-primary">
            Edit Post
          </Link>

          <button className="btn btn-danger"
                  onClick={this.onClickDelete.bind(this)}>
            Delete Post
          </button>
        </div>
        <Link to="/">Back to Posts</Link>
        <h3>{title}</h3>
        <h6>{categories}</h6>
        <p>{content}</p>
      </div>
    );
  }

}


export default connect(
  (state) => { return { post: state.posts.post } },
  { getPost, deletePost, emptyPost }
)(PostsForm);
