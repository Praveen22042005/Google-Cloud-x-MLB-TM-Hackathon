import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import HighlightList from './components/HighlightList';
import UserPreferences from './components/UserPreferences';
import HighlightDetail from './components/HighlightDetail';
import AdvancedSearch from './components/AdvancedSearch';
import RegisterUser from './components/RegisterUser';
import LoginUser from './components/LoginUser'; // Added
import UserProfile from './components/UserProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={props =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const NavBar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Personalized Fan Highlights
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/search">Advanced Search</Button>
        {user ? (
          <>
            <Button
              color="inherit"
              onClick={handleMenu}
              startIcon={<AccountCircle />}
            >
              {user.username}
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
              <MenuItem component={Link} to="/preferences" onClick={handleClose}>Preferences</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Container>
            <Switch>
              <PrivateRoute exact path="/" component={HighlightList} />
              <PrivateRoute path="/preferences" component={UserPreferences} />
              <PrivateRoute path="/profile" component={UserProfile} />
              <Route path="/register" component={RegisterUser} />
              <Route path="/login" component={LoginUser} /> {/* Added */}
              <PrivateRoute path="/highlights/:id" component={HighlightDetail} />
              <Route path="/search" component={AdvancedSearch} />
            </Switch>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;