import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Home from './home'
import TourDetails from './tourDetails'
import About from './about'
import Contact from './contact'

import Login from './login'
import ForgotPassword from './forgotPassword'

import Signup from './signup'

import ProtectedRoute from '../components/protectedRoute'
import Profile from './profile'
import Dashboard from './dashboard'


const Routes = () => {
  const { authenticated } = useSelector( state => state.users )

  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/tour/:slug' component={TourDetails} />

      <Route path='/about' component={About} />
      <Route path='/contact' component={Contact} />
      <Route path='/forgot-password' component={ForgotPassword} />

      <Route path='/login' component={Login} />
      <Route path='/signup' component={Signup} />
      {/*{ authenticated ? <Redirect to='/profile' /> : <Route path='/login' component={Login} /> }*/}
      {/*{ authenticated ? <Redirect to='/profile' /> : <Route path='/signup' component={Signup} /> }*/}

      <ProtectedRoute path='/profile' component={Profile} />
      <ProtectedRoute path='/dashboard' component={Dashboard} />

    </Switch>
  )
}

export default Routes
