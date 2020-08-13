import { useRef, useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import withApollo from '../../libs/withApollo'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const Container = styled.div`
  position: relative;
  padding: 48px 0 0;
`

const Form = styled.form`
  margin: 0 auto;
  padding: 24px 24px;
`

const TitleInput = styled.input`
  display: block;
  margin: 0 auto 24px;
  width: 100%;
  height: 32px;
`

const ContentInput = styled.textarea`
  display: block;
  margin: 0 auto 24px;
  width: 100%;
  height: 540px;
`

const SubmitButton = styled.button`
  display: block;
  float: right;
  cursor: pointer;
`

const Flash = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 240px;
  height: 32px;
  border: ${({ error }: { error?: boolean }) =>
    `1px solid ${error ? 'red' : '#90ee90'}`};
  margin: 0 auto;
  top: 24px;
  left: 0;
  right: 0;
`

const MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!) {
    id: createPost(title: $title, content: $content)
  }
`

const PostForm = () => {
  const titleInputRef = useRef(null)
  const contentInputRef = useRef(null)
  const [createPost, { data, error, loading }] = useMutation(MUTATION)
  const handleSubmit = (e) => {
    e.preventDefault()
    createPost({
      variables: {
        title: titleInputRef.current.value,
        content: contentInputRef.current.value,
      },
    })
  }

  const saved = !!data

  const [willRedirect, setWillRedirect] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (saved) {
      const willRedirectTimout = setTimeout(() => {
        setWillRedirect(true)
      }, 1000)
      const redirectTimeout = setTimeout(async () => {
        await router.replace('/posts/[id]', `/posts/${data.id}`)
      }, 2000)

      return () => {
        clearTimeout(willRedirectTimout)
        clearTimeout(redirectTimeout)
      }
    }
  }, [saved])

  if (willRedirect) {
    var flash = <Flash>Will redirect...</Flash>
  } else if (saved) {
    var flash = <Flash>Saved!</Flash>
  } else if (error) {
    var flash = <Flash error>Error!</Flash>
  }

  return (
    <Container>
      {flash}
      <Form onSubmit={handleSubmit}>
        <TitleInput
          placeholder="input title here"
          required
          disabled={saved}
          ref={titleInputRef}
        ></TitleInput>
        <ContentInput
          placeholder="input content here"
          disabled={saved}
          ref={contentInputRef}
        ></ContentInput>
        <SubmitButton type="submit" disabled={saved}>
          {loading ? 'saving' : 'save'}
        </SubmitButton>
      </Form>
    </Container>
  )
}

export default withApollo({ uri: 'http://localhost:3000/api/graphql' })(
  PostForm
)
