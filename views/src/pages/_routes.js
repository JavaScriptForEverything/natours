import { Switch, Route } from 'react-router-dom'

import Home from './home'
import TourDetails from './tourDetails'
import About from './about'

import Login from './login'
import ForgotPassword from './forgotPassword'

import Signup from './signup'

import Profile from './profile'
import Dashboard from './dashboard'


const Routes = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/tour/:id' component={TourDetails} />

      <Route path='/about' component={About} />
      <Route path='/login' component={Login} />
      <Route path='/forgot-password' component={ForgotPassword} />

      <Route path='/signup' component={Signup} />
      <Route path='/profile' component={Profile} />
      <Route path='/dashboard' component={Dashboard} />

    </Switch>
  )
}

export default Routes
