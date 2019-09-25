import React from 'react';
import { TodoDetailsPage } from './TodoDetailsPage';
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from '@material-ui/styles'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route path='/todos/:id' component={({match}: any) => <TodoDetailsPage todoId={match.params.id} />} />        
      </Router>
    </ThemeProvider>
  );
}

export default App;
