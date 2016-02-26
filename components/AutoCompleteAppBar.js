import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import AutoComplete from './AutoComplete';
import AddFoodDialog from './AddFoodDialog';
import MenuItem from 'material-ui/lib/menus/menu-item';
import {Spacing} from 'material-ui/lib/styles';
import request from 'request';

const searchApiEndpoint = 'https://test.holmusk.com/food/search?q=';

class AutoCompleteAppBar extends React.Component {
  
  constructor() {
    super();
    
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleAutoCompleteSelection = this.handleAutoCompleteSelection.bind(this);
    this.handleRequestCloseAddFoodDialog = this.handleRequestCloseAddFoodDialog.bind(this);
    this.handleRequestAddFoodItem = this.handleRequestAddFoodItem.bind(this);
    this.getSearchSuggestions = this.getSearchSuggestions.bind(this);

    this.state = {
      searchTerm: '',
      foodItems: [],
      dataSource: [],
      addFoodDialogOpen: false,
      selectedFoodItem: null,
    };
  }

  handleUpdateInput(searchTerm) {
    if (this.state.searchTerm != searchTerm) {
      this.setState({
        searchTerm: searchTerm,
      });
      // Only show suggestions when at least 3 characters are typed
      if (searchTerm.length < 3) {
        this.setState({
          dataSource: [],
        });
      } else {
        this.getSearchSuggestions(searchTerm);
      }
    }
  }
  
  handleAutoCompleteSelection(chosenRequest, index, dataSource) {
    if (index > -1) {
      // If index == -1, it means "Enter" key was pressed instead of selecting one of the menu items, so we ignore it.
      this.setState({
        selectedFoodItem: this.state.foodItems[index],
        addFoodDialogOpen: true,
      });
    }
  }
  
  handleRequestCloseAddFoodDialog() {
    this.setState({
      addFoodDialogOpen: false,
    });
  }
  
  handleRequestAddFoodItem() {
    this.handleRequestCloseAddFoodDialog();
    this.props.onRequestAddFoodItem(this.state.selectedFoodItem);
  }
  
  getSearchSuggestions(searchTerm) {
    request(searchApiEndpoint + searchTerm, (error, response, body) => {
      if (!error && response.statusCode == 200
          && this.state.searchTerm == searchTerm) {
        // Only parse response if it is received
        // before user changes the search term
        const items = JSON.parse(body);
        const itemNames = [];
        if (items.length) {
          for (let i = 0; i < Math.min(items.length, 10); i++) {
            itemNames.push(items[i].name);
          }
          this.setState({
            foodItems: items,
            dataSource: itemNames,
          });
        } else {
          this.setState({
            foodItems: [],
            dataSource: [{
              // Should not actually need to set the text, since this item is disabled, but the text is used as React component key
              text: searchTerm,
              value: (
                <MenuItem
                  primaryText="No food items found"
                  disabled={true}
                />
              ),
            },],
          });
        }
      }
    });
  }
  
  render() {
  
    const {
      onLeftIconButtonTouchTap,
      showMenuIconButton,
    } = this.props;
  
    const {
      dataSource,
      addFoodDialogOpen,
      selectedFoodItem
    } = this.state;
  
    const autoCompleteElement = (
      <AutoComplete
        hintText="Search food item"
        fullWidth={true}
        filter={AutoComplete.noFilter}
        dataSource={dataSource}
        onUpdateInput={this.handleUpdateInput}
        onNewRequest={this.handleAutoCompleteSelection}
        triggerUpdateOnFocus={true}
      />
    );
  
    const style = {};
    
    if (!this.props.showMenuIconButton) {
      // The width of the Left Nav is 256
      style.paddingLeft = 256 + Spacing.desktopGutter;
    }
    
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={onLeftIconButtonTouchTap}
          title={autoCompleteElement}
          showMenuIconButton={showMenuIconButton}
          style={style}
        />
        <AddFoodDialog
          open={addFoodDialogOpen}
          foodItem={selectedFoodItem}
          onRequestClose={this.handleRequestCloseAddFoodDialog}
          onRequestAddFoodItem={this.handleRequestAddFoodItem}
        />
      </div>
    )
  }
}

export default AutoCompleteAppBar;