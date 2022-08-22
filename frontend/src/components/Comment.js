import React from 'react'
import AddComment from './AddComment'
import './Post.css'

const Comment = props => {
  const [replyOpen, setReplyOpen] = React.useState(false)

  const toggleReply = () => setReplyOpen(!replyOpen)

  const saveComment = commentData => {
    setReplyOpen(false)
    props.onComment(props.comment._id, commentData)
  }

  const [isUpVoted, setUpVoteToggle] = React.useState(false)
  const [isDownVoted, setDownVoteToggle] = React.useState(false)

  const onUpVoteClick = () => {
    // upvote button is selected (downvote is by definition not selected)
    if (isUpVoted) {
      setUpVoteToggle(!isUpVoted);    // change isUpVoted to false
      // props.decrCUpVotes();     // we cannot upvote anymore since we've already upvoted (double clicking toggles upvote off)
      props.comment.upVotes--;    // decrement number upvotes
    }
    // otherwise, upvote button is not selected
    else {
      // case 1: downvote button is selected (meaning we have to unselect downvote)
      if (isDownVoted) {
        setDownVoteToggle(!isDownVoted);    // change isDownVoted to false
        // props.decrCDownVotes();        // decrement the number of downvotes (we are removing downvote)
        props.comment.downVotes--;
      }
      setUpVoteToggle(!isUpVoted);        // change isUpVoted to true
      // props.incrCUpVotes();          // increment num upvotes
      props.comment.upVotes++;
    }
  }

  const onDownVoteClick = () => {
    // downvote button is selected (upvote is by definition not selected)
    if (isDownVoted) {
      setDownVoteToggle(!isDownVoted);
      // props.decrCDownVotes();     // we cannot dv anymore since we've already downvoted (toggle off)
      props.comment.downVotes--;    // decrement number upvotes
    } else {
      if (isUpVoted) {
        setUpVoteToggle(!isUpVoted);    // change isDownVoted to false
        // props.decrCUpVotes();        // decrement the number of downvotes (we are removing downvote)
        props.comment.upVotes--;
      }
      setDownVoteToggle(!isDownVoted);        // change isUpVoted to true
      // props.incrCDownVotes();          // increment num upvotes
      props.comment.downVotes++;
    }
  }


  return (
    <>
      <section className="post">
        <div className="arrows">
          <button onClick={onUpVoteClick}>↑</button>
          <span className={isUpVoted ? "upVoteSelected" : isDownVoted ? "downVoteSelected" : "center"}>
            {props.comment.upVotes - props.comment.downVotes}
          </span>
          <button onClick={onDownVoteClick}>↓</button>
        </div>
        <div className="post-body">
          <div className="author">Posted by {props.comment.author}</div>
          <div>{props.comment.text}</div>
          <div className="button-row">
            <button onClick={_ => props.onDelete(props.comment._id)}>
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
        {props.comment.comments.map(com => (
          <Comment
            key={com._id}
            comment={com}
            onDelete={props.onDelete}
            onEdit={props.onEdit}
            onComment={props.onComment}
          />
        ))}
      </section>
    </>
  )
}

export default Comment
