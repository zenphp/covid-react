import React, {Component} from 'react';
import DataRow from "./DataRow";

class DataTable extends Component {

    renderHeader() {
        return (
            <tr>
                <th>Date</th>
                <th>State</th>
                <th>FIPS</th>
                <th>Cases</th>
                <th>Deaths</th>
            </tr>
        );
    }
   renderRows() {
       return this.props.rows.map((row, i) => {
           return (
               <DataRow row={row}/>
           );
       })
   }
    render() {
        return (
            <table>
                <thead>
                {this.renderHeader()}
                </thead>
                <tbody>
                {this.renderRows()}
                </tbody>
            </table>
        )
    }

}

export default DataTable;