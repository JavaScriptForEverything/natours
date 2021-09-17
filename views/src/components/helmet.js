import { Helmet } from 'react-helmet'

const ReactHelmet = ({ title }) => {
	return (
		<Helmet>
			<title>{title}</title>
		</Helmet>
	)
}

export default ReactHelmet
