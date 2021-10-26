import { Switch, Route } from 'react-router-dom'

import Layout from './layout'
import ProtectedRoute, { PreventedRoute } from './pages/_protect'

import Home from './pages/home'
import About from './pages/about'
import Contact from './pages/contact'
import TourDetails from './pages/tourDetails'

import Login from './pages/login'
import UserProfile from './pages/userProfile'
import UserDashboard from './pages/userDashboard'
import UserPasswordReset from './pages/userPasswordReset'
import UserUpdate from './pages/userUpdate'
import UserOrder from './pages/userOrder'
import UserPayment from './pages/userPayment'





const App = () => {

  return (
    <Layout>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/about' component={About} />
        <Route path='/contact' component={Contact} />
        <Route path='/tour/:slug' component={TourDetails} />

        <PreventedRoute path='/login' component={Login} />
        <PreventedRoute path='/reset-password' component={UserPasswordReset} />

        <ProtectedRoute path='/user/profile' component={UserProfile} />
        <ProtectedRoute path='/user/dashboard' component={UserDashboard} />
        <ProtectedRoute path='/user/update-me' component={UserUpdate} />
        <ProtectedRoute path='/user/order' component={UserOrder} />
        <ProtectedRoute path='/user/payment' component={UserPayment} />
      </Switch>


    </Layout>
  );
}

export default App
