import { Helmet } from 'react-helmet-async'

const Meta = ({ name, description, keyword }) => {
  return (
    <Helmet>
      <title>{name}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keyword} />
    </Helmet>
  )
}



export default Meta