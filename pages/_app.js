import styled from 'styled-components'
import '../styles/globals.css'

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
`

function MyApp({ Component, pageProps }) {
  return (
    <Container>
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp
