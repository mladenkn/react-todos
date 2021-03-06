import React from 'react';
import { TodoDetailsPage } from './TodoDetailsPage';
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from '@material-ui/styles'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { TodoListPage } from './TodoListPage';
import { createTodoLocalStorageDataApi } from '../dataAccess/todoDataApi';


const theme = createMuiTheme({
  overrides: {
    MuiDialog: {
      paper: {
        margin: 0,
      },
      paperWidthSm: {
        maxWidth: 'none',
      }
    }
  }
})

const App = () => {

  const api = createTodoLocalStorageDataApi()

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path='/'>
          <Redirect to="/todos" />
        </Route>
        <Route 
          path='/todos/:id' 
          component={({match}: any) => <TodoDetailsPage api={api} todoId={match.params.id} />} 
        />
        <Route 
          path='/todos' 
          exact 
          component={() => <TodoListPage api={api} />}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
