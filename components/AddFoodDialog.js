import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FoodItemNutritionTable from './FoodItemNutritionTable';
import FlatButton from 'material-ui/lib/flat-button';

const AddFoodDialog = ({
  open,
  foodItem,
  onRequestClose,
  onRequestAddFoodItem,
}) => {

  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={onRequestClose}
    />,
    <FlatButton
      label="Add"
      primary={true}
      onTouchTap={onRequestAddFoodItem}
    />,
  ];
    
  const foodDetails = foodItem ? (
      <div>
        <p>{foodItem.portions[0].name}</p>
        <FoodItemNutritionTable
          foodItem={foodItem}
        />
      </div>
    )
    : null;
    
  return (
    <Dialog
      title={foodItem ? foodItem.name : null}
      actions={actions}
      modal={false}
      open={open}
      autoDetectWindowHeight={true}
      autoScrollBodyContent={true}
      onRequestClose={onRequestClose}
    >
      {foodDetails}
    </Dialog>
  )
}

export default AddFoodDialog;
