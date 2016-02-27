import React from 'react';
import FoodItemNutritionTable from './FoodItemNutritionTable';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';
import moment from 'moment';

const MealDetailsPage = ({
  selectedMeal,
  loggedMeals,
  onRequestDeleteFoodItem,
}) => {

  const styles = {
    heading: {
      fontSize: 24,
      fontWeight: 400,
      marginBottom: 16,
    },
    card: {
      marginBottom: 8,
    },
  };

  let heading = '';
  let foodItems = [];
  let foodDetails = null;
  
  if (selectedMeal && typeof selectedMeal == 'number') {
    // A meal is selected
    for (let i = 0; i < loggedMeals.length; i++) {
      if (selectedMeal == loggedMeals[i].datetime.getTime()) {
        const meal = loggedMeals[i];
        heading = meal.mealName + " @ " + moment(meal.datetime).format("Do MMM YYYY, h:mm a");
        foodItems = meal.foodItems;
        break;
      }
    }
    
    if (foodItems.length) {
      foodDetails = foodItems.map((foodItem, index) => {
        return (
          <Card
            style={styles.card}
          >
            <CardTitle
              title={foodItem.name}
              subtitle={foodItem.portions[0].name}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <FoodItemNutritionTable
                foodItem={foodItem}
              />
            </CardText>
            <CardActions expandable={true}>
              <FlatButton
                label="Delete"
                primary={true}
                onTouchTap={onRequestDeleteFoodItem}
                data-fooditemindex={index}
              />
            </CardActions>
          </Card>
        );
      });
    } else {
      foodDetails = (
        <p>No food items have been added for this meal yet. Type a food name in the search bar above to find a food to add.</p>
      );
    }
  } else if (typeof selectedMeal == 'string') {
    // A date is selected
    heading = "All meals on " + selectedMeal;
    for (let i = 0; i < loggedMeals.length; i++) {
      if (selectedMeal == loggedMeals[i].datetime.toLocaleDateString()) {
        foodItems.push(...loggedMeals[i].foodItems);
      }
    }
    
    if (foodItems.length) {
      foodDetails = foodItems.map((foodItem, index) => {
        return (
          <Card
            style={styles.card}
          >
            <CardTitle
              title={foodItem.name}
              subtitle={foodItem.portions[0].name}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <FoodItemNutritionTable
                foodItem={foodItem}
              />
            </CardText>
          </Card>
        );
      });
    } else {
      foodDetails = (
        <p>No food items have been added for this date yet. Select a meal for this date using the left navigation side bar to start adding food items to that meal.</p>
      );
    }
  }

  return (
    <div>
    <div style={styles.heading}>{heading}</div>
      {foodDetails}
    </div>
  )
}

export default MealDetailsPage;
