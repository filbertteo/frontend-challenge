import React from 'react';
import Dialog from 'material-ui/lib/dialog';
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
    
  const foodDetails = JSON.stringify(foodItem);
    
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
