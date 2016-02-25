import React from 'react';
import AppBar from 'material-ui/lib/app-bar';
import AutoComplete from 'material-ui/lib/auto-complete';
import {Spacing} from 'material-ui/lib/styles';
import request from 'request';

const searchApiEndpoint = 'https://test.holmusk.com/food/search?q=';

class AutoCompleteAppBar extends React.Component {
  
  constructor() {
    super();
    
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.getSearchSuggestions = this.getSearchSuggestions.bind(this);

    this.state = {
      searchTerm: '',
      foodItems: [],
      dataSource: [],
    };
  }

  handleUpdateInput(searchTerm) {
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
            dataSource: ["No food items found",],
          });
        }
      }
    });
  }
  
  render() {
  
    const autoCompleteElement = (
      <AutoComplete
        hintText="Search food item"
        fullWidth={true}
        filter={AutoComplete.noFilter}
        dataSource={this.state.dataSource}
        onUpdateInput={this.handleUpdateInput}
      />
    );
  
    const style = {};
    
    if (!this.props.showMenuIconButton) {
      // The width of the Left Nav is 256
      style.paddingLeft = 256 + Spacing.desktopGutter;
    }
    
    return (
      <AppBar
        onLeftIconButtonTouchTap={this.props.onLeftIconButtonTouchTap}
        title={autoCompleteElement}
        showMenuIconButton={this.props.showMenuIconButton}
        style={style}
      />
    )
  }
}

export default AutoCompleteAppBar;