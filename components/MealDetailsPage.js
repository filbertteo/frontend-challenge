import React from 'react';
import moment from 'moment';

const MealDetailsPage = ({
  selectedMeal,
  loggedMeals,
  onRequestDeleteFoodItem,
}) => {

  let title = '';
  let foodItems = [];
  let foodDetails = null;
  
  if (selectedMeal && typeof selectedMeal == 'number') {
    // A meal is selected
    for (let i = 0; i < loggedMeals.length; i++) {
      if (selectedMeal == loggedMeals[i].datetime.getTime()) {
        const meal = loggedMeals[i];
        title = meal.mealName + " @ " + moment(meal.datetime).format("Do MMM YYYY, h:mm a");
        foodItems = meal.foodItems;
        break;
      }
    }
    
    if (foodItems.length) {
      // Placeholder
      foodDetails = (
        <p>{JSON.stringify(foodItems)}</p>
      );
    } else {
      foodDetails = (
        <p>No food items have been added for this meal yet. Type a food name in the search bar above to find a food to add.</p>
      );
    }
  } else if (typeof selectedMeal == 'string') {
    // A date is selected
    title = "All meals on " + selectedMeal;
    for (let i = 0; i < loggedMeals.length; i++) {
      if (selectedMeal == loggedMeals[i].datetime.toLocaleDateString()) {
        foodItems.push(...loggedMeals[i].foodItems);
      }
    }
    
    if (foodItems.length) {
      // Placeholder
      foodDetails = (
        <p>{JSON.stringify(foodItems)}</p>
      );
    } else {
      foodDetails = (
        <p>No food items have been added for this date yet. Select a meal for this date using the left navigation side bar to start adding food items to that meal.</p>
      );
    }
  }

  return (
    <div>
    <h2>{title}</h2>
      {foodDetails}
    </div>
  )
}

export default MealDetailsPage;
