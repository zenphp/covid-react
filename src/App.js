import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Papa from "papaparse";
import DataTable from "./DataTable";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            headers: [],
            filter: null,
            filterOptions: []
        };

        this.getData = this.getData.bind(this);
    }

    fetchCsv() {
        return fetch('/data/covid/us-states.csv').then(function (response) {
            let reader = response.body.getReader();
            let decoder = new TextDecoder('utf-8');

            return reader.read().then(function (result) {
                return decoder.decode(result.value);
            });
        });
    }

    componentWillMount() {
        this.getCsvData();
    }

    getData(result) {
        var data = result.data;
        var headers = data.shift();

        data.sort(function (a, b) {
            if (a.state === b.state) {
                return 0;
            }
            if (a.state > b.state) {
                return 1;
            }
            return -1;
        });

        const arrayColumn = (arr, n) => arr.map(x => x[n]);
        var filterOptions = arrayColumn(data, 1);

        let chartData = data.filter((item, i, ar) => item.state === "New York");
        let unique = filterOptions.filter((item, i, ar) => ar.indexOf(item) === i);

        this.setState({
            data: data,
            headers: headers,
            filterOptions: unique,
            chartData: chartData
        });
    }

    async getCsvData() {
        let csvData = await this.fetchCsv();

        Papa.parse(csvData, {
            dynamicTyping: true,
            header: true,
            complete: this.getData
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1>Simple Covid Data Browser</h1>

                    <h3>Graph of NY Data</h3>
                    <ResponsiveContainer aspect="2" >
                        <LineChart
                            data={this.state.chartData}
                            margin={{top: 10, right: 80, left: 80, bottom: 100}}
                        >
                            <XAxis dataKey="date" angle="45" type="category" />
                            <YAxis dataKey="cases" label="Cases" type="number" scale='linear' domain={[0, 'dataMax + 1000']} yAxisId="0" />
                            <YAxis dataKey="deaths" type="number" scale='linear' domain={[0, 'dataMax + 1000']}  orientation="right" yAxisId="1" />
                            <Tooltip/>
                            <CartesianGrid/>
                            <Line  dataKey="cases" name="cases" type="monotone" stroke="#ff7300" yAxisId={0}/>
                            <Line  dataKey="deaths" name="deaths" type="monotone" stroke="#ff3300" yAxisId={1}/>
                            <Legend verticalAlign="top" />
                        </LineChart>
                    </ResponsiveContainer>
                </header>
                <DataTable headers={this.state.headers} rows={this.state.data} filter={this.state.filter}/>
            </div>
        );
    }

    filterBy(fipsVal) {
        if (fipsVal !== '') {
            this.setState({filter: fipsVal});
        } else {
            this.setState({filter: null});
        }
    }
}

export default App;
