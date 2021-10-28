// import { Elements } from '@stripe/react-stripe-js'
// import { loadStripe } from '@stripe/stripe-js'

import MetaData from '../components/metaData'
import CheckoutForm from '../stripe'

// const STRIPE_PUBLISHABLE_KEY = 'pk_test_51ItvK3JhjiJCVOZfZnfoHak0bLiwbZl4wQ79P8bXtYkNzsXGSkecOLQK6ixKmO66jP1uxUBRekPsTWXG56ypl7Hf00xnosg6hw'

const UserPayment = () => {


	return (
		<>
			<MetaData title='Payment Page' />
			{/*-----[ start coding bellow here ]------*/}

			{/*<Elements stripe={loadStripe(STRIPE_PUBLISHABLE_KEY)}>*/}
				<CheckoutForm />
			{/*</Elements>*/}


		</>
	)
}
export default UserPayment
