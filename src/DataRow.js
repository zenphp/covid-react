import React, {Component} from 'react';

class DataRow extends Component {
    render() {
        return (
            <tr>
                <td>{ this.props.row[0]}</td>
                <td>{ this.props.row[1]}</td>
                <td>{ this.props.row[2]}</td>
                <td>{ this.props.row[3]}</td>
                <td>{ this.props.row[4]}</td>
            </tr>
        );
    }
}

export default DataRow;