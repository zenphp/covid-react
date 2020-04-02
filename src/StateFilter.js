import React, {Component} from "react";

class StateFilter extends Component {

    renderOptions() {
        return this.props.filterOptions.map((state, i) => {
            return (
                <option value={state}>{state}</option>
            );
        })
    }

    render() {
        return (
            <div>
                <label htmlFor="filter">Select a state to filter:</label>
                <select name="filter" onChange={this.props.onChange}>
                    {this.renderOptions()}
                </select>
            </div>
        )
    }
}

export default StateFilter;