import React, { useState } from 'react'
import './App.css'
import Post from './components/Post'
import AddPost from './components/AddPost'
import SortBy from './components/SelectDateRange'

const App = () => {
  const [posts, setPosts] = React.useState([])
  const headers = { 'Content-Type': 'application/json' }
  const getPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.posts))
  }

  React.useEffect(() => {
    // get posts on startup
    getPosts()
  }, [])

  const getPostsByDate = selectedDateRange => {
    // get the current date to send to the server (for accuracy)
    const date = new Date()
    const dateString = date.toISOString()

    fetch(`/api/posts?dateRange=${selectedDateRange}&currDate=${dateString}`)
      .then(response => response.json())
      .then(data => setPosts(data.posts))
  }

  const createPost = postData => {
    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
      headers,
    })
      .then(response => response.json())
      .then(data => setPosts([...posts, data.post]))
  }

  const deletePost = postId => {
    fetch('/api/posts/' + postId, { method: 'DELETE' }).then(() => {
      const postsWithIdDeleted = posts.filter(post => post._id !== postId)
      setPosts(postsWithIdDeleted)
    })
  }

  const editPost = (postId, postData) => {
    fetch('/api/posts/' + postId, {
      method: 'PATCH',
      body: JSON.stringify(postData),
    })
      .then(res => res.json())
      .then(data => {
        // if post Id matches the edited post, update
        const postsWithIdEdited = posts.map(post =>
          postId === post._id ? data.post : post
        )
        setPosts(postsWithIdEdited)
      })
  }

  const createComment = (commentId, commentData) => {
    fetch(`/api/posts/${commentId}/comment`, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers,
    })
      .then(res => res.json())
      .then(data => {
        const postsWithCommentAdded = posts.map(post =>
          post._id === data.post._id ? data.post : post
        )
        setPosts(postsWithCommentAdded)
      })
  }

  const deleteComment = commentId => {
    fetch('/api/comments/' + commentId, { method: 'DELETE' }).then(() => {
      getPosts() // get up-to-date posts after comment is added
    })
  }

  const editComment = (commentId, commentData) => {
    fetch('/api/comments/' + commentId, {
      method: 'PATCH',
      body: JSON.stringify(commentData),
    }).then(() => {
      getPosts()
    })
  }

  const createSubComment = (commentId, commentData) => {
    fetch(`/api/comments/${commentId}/comment`, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers,
    }).then(() => {
      getPosts()
    })
  }

  const [upVoteCount, setUpVoteCount] = useState(0);
  const [downVoteCount, setDownVoteCount] = useState(0);

  const incrUpVotes = () => {
    setUpVoteCount(upVoteCount + 1) 
  }
  const decrUpVotes = () => { 
    setUpVoteCount(upVoteCount - 1) 
  }
  const incrDownVotes = () => {
    setDownVoteCount(downVoteCount + 1);
  }
  const decrDownVotes = () => {
    setDownVoteCount(downVoteCount - 1);
  }

  return (
    <>
      <h1>Hack4Impact Reddit Project</h1>
      <AddPost onSubmit={createPost} />
      <SortBy onSelect={getPostsByDate} />
      {posts.map(curr => (
        <Post
          key={curr._id}
          post={curr}
          onDelete={deletePost}
          onEdit={editPost}
          onComment={createComment}
          onCommentDelete={deleteComment}
          onCommentEdit={editComment}
          onSubComment={createSubComment}
          incrUpVotes={incrUpVotes}
          decrUpVotes={decrUpVotes}
          incrDownVotes={incrDownVotes}
          decrDownVotes={decrDownVotes}
        />
      ))}
    </>
  )
}

export default App
