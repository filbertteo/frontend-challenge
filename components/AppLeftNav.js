import React from 'react';
import LeftNav from 'material-ui/lib/left-nav';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
import {
  Colors,
  Spacing,
  Typography,
} from 'material-ui/lib/styles';

const SelectableList = SelectableContainerEnhance(List);

class AppLeftNav extends React.Component{
  
  constructor() {
    super();
    
    this.getStyles = this.getStyles.bind(this);
  }

  getStyles() {
    return {
      logo: {
        fontSize: 24,
        color: Typography.textFullWhite,
        lineHeight: `${Spacing.desktopKeylineIncrement}px`,
        backgroundColor: Colors.cyan500,
        paddingLeft: Spacing.desktopGutter,
        marginBottom: 8,
      },
    };
  }

  render() {
    const {
      docked,
      onRequestChangeLeftNav,
      onRequestChangeList,
      onRequestOpenAddMealDialog,
      onRequestDeleteMeal,
      open,
      loggedMeals,
      selectedMeal,
    } = this.props;

    const styles = this.getStyles();
    
    let mealsList = null;
    
    if (loggedMeals.length) {
    
      let dates = [];
      
      for (let i = 0; i < loggedMeals.length; i++) {
        if (!dates.length || dates[dates.length - 1].dateString != loggedMeals[i].datetime.toLocaleDateString()) {
          // We assume that the logged meals are properly sorted by date
          // If dates array is empty, or the value for the "dateString" key for the last element in the dates array is not the date of the current logged meal, we add a new date entry into the array
          dates.push({
            dateString: loggedMeals[i].datetime.toLocaleDateString(),
            meals: []
          });
        }
        dates[dates.length - 1].meals.push(loggedMeals[i]);
      }
      
      let datesList = dates.map(dateItem => {
        let mealsForDateList = dateItem.meals.map(meal => {
          return (
            <ListItem
              primaryText={meal.mealName}
              value={meal.datetime.getTime()}
              rightIconButton={
                <IconButton
                  touch={true}
                  tooltip="Delete"
                  tooltipPosition="bottom-left"
                  onTouchTap={onRequestDeleteMeal}
                  // Attach the meal ID to the delete button so that we can identify which meal to delete.
                  data-mealid={meal.datetime.getTime()}
                >
                  <FontIcon
                    className="material-icons"
                  >
                    delete
                  </FontIcon>
                </IconButton>
              }
            />
          );
        });
        
        // Set initiallyOpen to true if the currently selected meal is for this date, so that user can see the newly added meal highlighted. But only works if there are no existing meals for this date already.
        let initiallyOpen = false;
        for (let i = 0; i < dateItem.meals.length; i++) {
          if (selectedMeal === dateItem.meals[i].datetime.getTime()) {
            initiallyOpen = true;
            break;
          }
        }
        
        return (
          <ListItem
            primaryText={dateItem.dateString}
            value={dateItem.dateString}
            initiallyOpen={initiallyOpen}
            nestedItems={mealsForDateList}
          />
        );
      });
    
      mealsList = (
        <SelectableList
          subheader="Logged meals"
          valueLink={{value: selectedMeal, requestChange: onRequestChangeList}}
        >
          {datesList}
        </SelectableList>
      )
    }

    return (
      <LeftNav
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeLeftNav}
      >
        <div style={styles.logo}>
          My Meal Log
        </div>
        <List>
          <ListItem
            primaryText="Add a meal..."
            rightIcon={
              <FontIcon className="material-icons">add_box</FontIcon>
            }
            onTouchTap={onRequestOpenAddMealDialog}
          />
        </List>
        <Divider />
        {mealsList}
      </LeftNav>
    );
  }
}

AppLeftNav.propTypes = {
  docked: React.PropTypes.bool.isRequired,
  onRequestChangeLeftNav: React.PropTypes.func.isRequired,
  onRequestChangeList: React.PropTypes.func.isRequired,
  onRequestOpenAddMealDialog: React.PropTypes.func.isRequired,
  onRequestDeleteMeal: React.PropTypes.func.isRequired,
  open: React.PropTypes.bool.isRequired,
  loggedMeals: React.PropTypes.array.isRequired,
};

export default AppLeftNav;
