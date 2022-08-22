import React from 'react'
import Comment from './Comment'
import AddComment from './AddComment'
import './Post.css'

const Post = props => {
  const [replyOpen, setReplyOpen] = React.useState(false)

  const toggleReply = () => setReplyOpen(!replyOpen)

  const saveComment = commentData => {
    setReplyOpen(false)
    props.onComment(props.post._id, commentData)
  }

  /* part 1 of frontend issue below */
  const priorNumVotes = props.post.upVotes - props.post.downVotes;   // use to compare if any upvote/downvote has occurred
  const [currNumVotes, setVotes] = React.useState(priorNumVotes);

  const [isUpVoted, setUpVoteToggle] = React.useState(false)
  const [isDownVoted, setDownVoteToggle] = React.useState(false)

  const onUpVoteClick = () => {
    // upvote button is selected (downvote is by definition not selected)
    if (isUpVoted) {
      setUpVoteToggle(!isUpVoted);    // change isUpVoted to false
      props.decrUpVotes();     // we cannot upvote anymore since we've already upvoted (double clicking toggles upvote off)
      props.post.upVotes--;    // decrement number upvotes
    }
    // otherwise, upvote button is not selected
    else {
      // case 1: downvote button is selected (meaning we have to unselect downvote)
      if (isDownVoted) {
        setDownVoteToggle(!isDownVoted);    // change isDownVoted to false
        props.decrDownVotes();        // decrement the number of downvotes (we are removing downvote)
        props.post.downVotes--;
      }
      setUpVoteToggle(!isUpVoted);        // change isUpVoted to true
      props.incrUpVotes();          // increment num upvotes
      props.post.upVotes++;
    }
  }

  const onDownVoteClick = () => {
    // downvote button is selected (upvote is by definition not selected)
    if (isDownVoted) {
      setDownVoteToggle(!isDownVoted);
      props.decrDownVotes();     // we cannot dv anymore since we've already downvoted (toggle off)
      props.post.downVotes--;    // decrement number upvotes
    } else {
      if (isUpVoted) {
        setUpVoteToggle(!isUpVoted);    // change isDownVoted to false
        props.decrUpVotes();        // decrement the number of downvotes (we are removing downvote)
        props.post.upVotes--;
      }
      setDownVoteToggle(!isDownVoted);        // change isUpVoted to true
      props.incrDownVotes();          // increment num upvotes
      props.post.downVotes++;
    }
  }

  return (
    <>
      <section className="post">
        <div className="arrows">
          <button onClick={onUpVoteClick}>↑</button>
          <span className={isUpVoted ? "upVoteSelected" : isDownVoted ? "downVoteSelected" : "center"}>
            {props.post.upVotes - props.post.downVotes}
          </span>
          <button onClick={onDownVoteClick}>↓</button>
        </div>
        <div className="post-body">
          <div className="author">Posted by {props.post.author}</div>
          <div className="header">{props.post.title}</div>
          <div>{props.post.text}</div>
          <div className="button-row">
            <button onClick={() => props.onDelete(props.post._id)}>
              Delete
            </button>
            <button onClick={toggleReply}>Reply</button>​
            {replyOpen && (
              <AddComment
                onSubmit={saveComment}
                onCancel={() => setReplyOpen(false)}
              />
            )}
          </div>
        </div>
      </section>
      <section className="comments">
        {props.post.comments.map(com => (
          <Comment
            key={com._id}
            comment={com}
            onDelete={props.onCommentDelete}
            onEdit={props.onCommentEdit}
            onComment={props.onSubComment}
          />
        ))}
      </section>
    </>
  )
}

export default Post
