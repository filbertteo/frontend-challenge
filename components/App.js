import React from 'react';
import AutoCompleteAppBar from './AutoCompleteAppBar';
import AppLeftNav from './AppLeftNav';
import AddMealDialog from './AddMealDialog';
import Snackbar from 'material-ui/lib/snackbar';
import {Spacing} from 'material-ui/lib/styles';
import {StyleResizable} from 'material-ui/lib/mixins';

// Define "enum" for Snackbar actions
const SnackbarActions = {
  UNDEFINED: 0,
  UNDO_DELETE_MEAL: 1,
};

// 'App' has to use the traditional syntax because ES6
// does not support React mixins. The StyleResizable
// mixin is to support responsive design
const App = React.createClass({

  mixins: [
    StyleResizable,
  ],
  
  getInitialState: function() {
    let loggedMeals = [];
    
    if (localStorage.loggedMeals) {
      loggedMeals = JSON.parse(localStorage.loggedMeals);
    }
    
    // Convert from string representation to Date object
    for (let i = 0; i < loggedMeals.length; i++) {
      loggedMeals[i].datetime = new Date(loggedMeals[i].datetime);
    }
    
    return {
      loggedMeals: loggedMeals,
      selectedMeal: 0,
      leftNavOpen: false,
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarActionText: null,
      snackbarAction: SnackbarActions.UNDEFINED,
      addMealDialogOpen: false,
      addMealDialogDefaultDatetime: null,
      lastDeletedMeal: null,
    };
  },

  handleTouchTapLeftIconButton: function() {
    this.setState({
      leftNavOpen: !this.state.leftNavOpen,
    });
  },
  
  handleRequestChangeLeftNav: function(open) {
    this.setState({
      leftNavOpen: open,
    });
  },
  
  handleRequestChangeList: function(event, index) {
    this.setState({
      selectedMeal: index,
    });
  },
  
  handleRequestOpenAddMealDialog: function() {
    const currentdatetime = new Date();
    this.setState({
      leftNavOpen: false,
      addMealDialogOpen: true,
      addMealDialogDefaultDatetime: currentdatetime,
    });
  },
  
  handleRequestCloseAddMealDialog: function() {
    this.setState({
      addMealDialogOpen: false,
    });
  },
  
  handleRequestAddMeal: function(datetime, mealName) {
    if (this.checkMealAlreadyExists(datetime)) {
      this.setState ({
        // Show Snackbar with error message
        addMealDialogOpen: false,
        snackbarOpen: true,
        snackbarMessage: "A meal with this date and time already exists.",
        snackbarActionText: null,
        snackbarAction: SnackbarActions.UNDEFINED,
        selectedMeal: datetime.getTime(),
      });
    } else {
    
      this.addMeal({
        datetime: datetime,
        mealName: mealName,
        foodItems: []
      });
      
      this.setState({
        addMealDialogOpen: false,
        selectedMeal: datetime.getTime(),
      });
    }
  },
  
  handleRequestDeleteMeal: function(event) {
    this.deleteMeal(event.target.dataset.mealid);
  },
  
  addMeal: function(meal) {
    const loggedMeals = this.state.loggedMeals;

    // Add meal to array of logged meals
    loggedMeals.push(meal);
      
    // Sort logged meals in reverse chronological order
    loggedMeals.sort(this.compareDatetime);
    loggedMeals.reverse();
      
    this.setState({
      loggedMeals: loggedMeals,
    });
      
    // Save to local storage
    localStorage.loggedMeals = JSON.stringify(loggedMeals);
  },
  
  deleteMeal: function(mealId) {
    const loggedMeals = this.state.loggedMeals;
    let mealToDelete = null;
    for (let i = 0; i < loggedMeals.length; i++) {
      if (loggedMeals[i].datetime.getTime() == mealId) {
        mealToDelete = loggedMeals[i];
        loggedMeals.splice(i, 1);
        break;
      }
    }
    
    const message = mealToDelete.mealName + " on " + mealToDelete.datetime.toLocaleDateString() + " has been deleted.";
    
    this.setState({
      loggedMeals: loggedMeals,
      lastDeletedMeal: mealToDelete,
      snackbarOpen: true,
      snackbarMessage: message,
      snackbarActionText: "Undo",
      snackbarAction: SnackbarActions.UNDO_DELETE_MEAL,
      selectedMeal: 0,
    });
    
    // Save to local storage
    localStorage.loggedMeals = JSON.stringify(loggedMeals);
  },
  
  checkMealAlreadyExists: function(datetime) {
    if (this.state.loggedMeals.length) {
      for (let i = 0; i < this.state.loggedMeals.length; i++) {
        if (this.state.loggedMeals[i].datetime.getTime() ===
            datetime.getTime()) {
          return true;
        }
      }
      return false;
    }
    return false;
  },
  
  handleSnackbarActionTouchTap: function() {
    switch (this.state.snackbarAction) {
      case SnackbarActions.UNDO_DELETE_MEAL:
        this.addMeal(this.state.lastDeletedMeal);
        break;
    }
    this.handleRequestCloseSnackbar();
  },
  
  handleRequestCloseSnackbar: function() {
    this.setState({
      snackbarOpen: false,
    });
  },
  
  // TODO Refactor this into a utility function
  compareDatetime: function(a, b) {
    if (a.datetime.getTime() < b.datetime.getTime())
      return -1;
    else if (a.datetime.getTime() > b.datetime.getTime())
      return 1;
    else
      return 0;
  },

  getStyles: function() {

    const styles = {
      root: {
        minHeight: 400,
      },
      content: {
        margin: Spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${Spacing.desktopGutter * 2}px ${Spacing.desktopGutter * 3}px`,
      },
    };

    if (this.isDeviceSize(StyleResizable.statics.Sizes.MEDIUM) ||
        this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    }

    return styles;
  },
  
  render: function() {
  
    let {
      leftNavOpen,
    } = this.state;
    
    const styles = this.getStyles();
    
    let docked = false;
    
    if (this.isDeviceSize(StyleResizable.statics.Sizes.LARGE)) {
      docked = true;
      leftNavOpen = true;
      styles.root.paddingLeft = 256;
    }
    
    return (
      <div>
        <AutoCompleteAppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          showMenuIconButton={!docked}
        />
        <div style={styles.root}>
          <div style={styles.content}>
          </div>
        </div>
        <AppLeftNav
          docked={docked}
          onRequestChangeLeftNav={this.handleRequestChangeLeftNav}
          onRequestChangeList={this.handleRequestChangeList}
          onRequestOpenAddMealDialog={this.handleRequestOpenAddMealDialog}
          onRequestDeleteMeal={this.handleRequestDeleteMeal}
          open={leftNavOpen}
          loggedMeals={this.state.loggedMeals}
          selectedMeal={this.state.selectedMeal}
        />
        <AddMealDialog
          open={this.state.addMealDialogOpen}
          onRequestClose={this.handleRequestCloseAddMealDialog}
          onRequestAddMeal={this.handleRequestAddMeal}
          defaultDatetime={this.state.addMealDialogDefaultDatetime}
        />
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          action={this.state.snackbarActionText}
          autoHideDuration={4000}
          onActionTouchTap={this.handleSnackbarActionTouchTap}
          onRequestClose={this.handleRequestCloseSnackbar}
        />
      </div>
    )
  }
});

export default App;