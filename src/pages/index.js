import * as React from "react"
import { useState } from "react"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'

const BlogIndex = ({ data, location }) => {
  let newPosts = {}
  let siteTitle = "Cloudflare Demo Blog"
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [body, setBody] = useState("")
  const [imagebase64,setImageBase64] = useState("")  
  let url = "https://worker_oa.swsr12493378.workers.dev"

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  let handleImageChange = (e) => {
    setImage(e.target.value);
    console.log("file_as_base64")
    console.log(getBase64(e.target.files[0]))
  }

  let handleBodyChange = (e) => {
    setBody(e.target.value);
  }

  let getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";      
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        setImageBase64(baseURL)
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };

  React.useEffect(() => {
    async function fetchData() {
      let response = await fetch(url)
      response = await response.json()
      newPosts = response
      siteTitle = newPosts.title
      setLoading(false);
      setPosts(response);
    }
    fetchData()
  }, []);

  let addPost = async () => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id:Math.random(), title: title, data: body, upvotes: 0, downvotes: 0, image: imagebase64})
    };
    const response = await fetch(url, requestOptions);
    console.log("Response for POST request")
    console.log(response)
    const data = await response
    console.log("Data posted!")
}

let addVote = async (type,id) => {
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id:id, type: type})
  };
  const response = await fetch(url+"/vote", requestOptions);
  console.log("Response for POST request")
  console.log(response)
  const data = await response
  console.log("Voted!")
}

const handleAddPost = async () => {
  await addPost()
  window.location.reload(); 
}

let handleVote = async(type,id) => {
  await addVote(type,id)
  window.location.reload(); 
}

if (loading) {
  // return "Loading....";
  return (<center><Spinner animation="border" role="status">
  <span className="visually-hidden">Loading...</span>
</Spinner></center>)
}

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <Bio />
      {posts.map(post => {
        const title = post.title

        return (
          <div>
            <Card >
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>
                  {post.date}<br />
                  {post.image != null ? <Image src={post.image} fluid /> : <div></div>
                  }
                  {post.data}
                </Card.Text>
                <Button onClick={() => handleVote("upvote", post.id)} variant="success">👍 {post.upvotes}</Button>{'  '}
                <Button onClick={() => handleVote("downvote", post.id)} variant="danger">👎 {post.downvotes}</Button>{'  '}
              </Card.Body>
            </Card> <br />
          </div>

        )
      })}
      <div className="d-grid gap-2">
        <Button variant="primary" size="lg" onClick={handleShow}>
          + Add a new post
        </Button>
      </div>



      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a new post</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form>
            <Form.Group className="mb-3" controlId="formBasicTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} type="text" onChange={handleTitleChange} placeholder="Title" />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload an image for your post</Form.Label>
              <Form.Control value={image} onChange={handleImageChange} type="file" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicBody">
              <Form.Label>Body</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Body"
                style={{ height: '100px' }}
                value={body} onChange={handleBodyChange}
              />
            </Form.Group>

          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddPost}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  )
}

export default BlogIndex