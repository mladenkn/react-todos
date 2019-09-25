import React from 'react';
import { TodoDetailsPage } from './TodoDetailsPage';
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from '@material-ui/styles'

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
      <div>
        <TodoDetailsPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
