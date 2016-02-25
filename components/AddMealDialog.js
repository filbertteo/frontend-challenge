import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import TextField from 'material-ui/lib/text-field';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';

class AddMealDialog extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.getDefaultInitialState = this.getDefaultInitialState.bind(this);
    this.handleSelectDate = this.handleSelectDate.bind(this);
    this.handleSelectTime = this.handleSelectTime.bind(this);
    this.handleDropDownMenuSelection = this.handleDropDownMenuSelection.bind(this);
    this.updateCustomMealName = this.updateCustomMealName.bind(this);
    this.addMeal = this.addMeal.bind(this);

    this.state = this.getDefaultInitialState();
  }
  
  getDefaultInitialState() {
    return {
      mealValue: 1,
      mealName: 'Breakfast',
      customMealName: '',
      selectedDate: null,
      selectedTime: null,
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (!this.props.open && nextProps.open &&
          typeof nextProps.defaultDatetime == 'object') {
        // Update the selected date and time if dialog is opening
        this.setState({
          selectedDate: nextProps.defaultDatetime,
          selectedTime: nextProps.defaultDatetime,
        });
      } else if (this.props.open && !nextProps.open) {
        // Reset the state to default if dialog is closing
        this.setState(this.getDefaultInitialState());
      }
    }
  }

  handleSelectDate(event, date) {
    this.setState({
      selectedDate: date,
    });
  }

  handleSelectTime(event, time) {
    this.setState({
      selectedTime: time,
    });
  }

  handleDropDownMenuSelection(event, index, value) {
  
    let mealName;
    
    switch (value) {
      case 1:
        mealName = "Breakfast";
        break;
      case 2:
        mealName = "Lunch";
        break;
      case 3:
        mealName = "Dinner";
        break;
      case 4:
        mealName = this.state.customMealName;
        break;
    }
  
    this.setState({
      mealValue: value,
      mealName: mealName
    });
    
    if (value == 4) {
      // It's not possible to set focus to the TextField for
      // custom meal name without using a callback, but
      // setImmediate() doesn't work (DropDownMenu doesn't close),
      // so we're using setTimeout with 0 delay
      setTimeout(() => {
        this._mealNameInput.focus();
      }, 0);
    }
  }

  updateCustomMealName(event) {
    // Only update mealName if "Custom:" is selected, which should
    // be the case since the TextField is disabled otherwise. But
    // including this to allow flexibility in case of future changes.
    if (this.state.mealValue == 4) {
      this.setState({
        customMealName: event.target.value,
        mealName: event.target.value
      });
    } else {
      this.setState({
        customMealName: event.target.value,
      });
    }
  }
  
  addMeal() {
    // TODO Refactor this into a utility function
    const datetime = new Date(
      this.state.selectedDate.getFullYear(),
      this.state.selectedDate.getMonth(),
      this.state.selectedDate.getDate(),
      this.state.selectedTime.getHours(),
      this.state.selectedTime.getMinutes()
    );      // We are ignoring the seconds

    this.props.onRequestAddMeal(datetime, this.state.mealName);
  }
  
  render() {
  
    const {
      open,
      onRequestClose,
      defaultDatetime
    } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={onRequestClose}
      />,
      <FlatButton
        label="Add"
        primary={true}
        disabled={!(this.state.mealName && this.state.selectedDate && this.state.selectedTime)}
        onTouchTap={this.addMeal}
      />,
    ];
    
    return (
      <Dialog
        title="Add a Meal"
        actions={actions}
        modal={false}
        open={open}
        onRequestClose={onRequestClose}
      >
        <DatePicker
          hintText="Meal date"
          defaultDate={defaultDatetime}
          onChange={this.handleSelectDate}
          autoOk={true}
        />
        <TimePicker
          hintText="Meal time"
          defaultTime={defaultDatetime}
          onChange={this.handleSelectTime}
        />
        <DropDownMenu
          value={this.state.mealValue}
          onChange={this.handleDropDownMenuSelection}
          floatingLabelText="Meal name"
        >
          <MenuItem value={1} primaryText="Breakfast" />
          <MenuItem value={2} primaryText="Lunch" />
          <MenuItem value={3} primaryText="Dinner" />
          <MenuItem value={4} primaryText="Custom:" />
        </DropDownMenu>
        <TextField
          ref={component => this._mealNameInput = component}
          value={this.state.customMealName}
          maxLength="15"
          onChange={this.updateCustomMealName}
          disabled={this.state.mealValue != 4}
          hintText={this.state.mealValue == 4 ? "Enter meal name" : ""}
        />
      </Dialog>
    )
  }
}

export default AddMealDialog;