import React from 'react';
import Table from 'material-ui/lib/table/table';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

const FoodItemNutritionTable = ({foodItem,}) => {
    
  const foodDetails = JSON.stringify(foodItem);
  
  let getNutrientName = key => {
    return key.replace(/_/g, " ").replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    });
  };
  
  const tableRows = [];
  
  if (foodItem) {
    const nutrients = foodItem.portions[0].nutrients.important;
    for (let key in nutrients) {
      let amount = "N/A";
      if (nutrients[key]) {
        amount = nutrients[key].value + " " + nutrients[key].unit;
      }
      
      tableRows.push(
        <TableRow>
          <TableRowColumn>{getNutrientName(key)}</TableRowColumn>
          <TableRowColumn>{amount}</TableRowColumn>
        </TableRow>
      );
    }
  }
    
  return (
    <div>
      <Table
        selectable={false}
      >
        <TableBody
          displayRowCheckbox={false}
          showRowHover={false}
          stripedRows={false}
        >
          {tableRows}
        </TableBody>
      </Table>
    </div>
  )
}

export default FoodItemNutritionTable;
