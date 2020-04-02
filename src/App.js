import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Papa from "papaparse";
import DataTable from "./DataTable";
import StateFilter from "./StateFilter";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList } from 'recharts';
import { scalePow, scaleLog } from 'd3-scale';

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
        return fetch('/data/covid-19-data/us-states.csv').then(function (response) {
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
            if (a[1] === b[1]) {
                return 0;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return -1;
        });

        const arrayColumn = (arr, n) => arr.map(x => x[n]);
        var filterOptions = arrayColumn(data, 1);

        let chartData = data.filter((item, i, ar) => item[1] === "New York");
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
            complete: this.getData
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1>Simple Covid Data Browser</h1>
                    <StateFilter filterOptions={this.state.filterOptions} onChange={this.filterBy}/>

                    <LineChart
                        width={1280}
                        height={400}
                        data={this.state.chartData}
                        margin={{top: 5, right: 20, left: 10, bottom: 5}}
                    >
                        <XAxis dataKey="0" name="date"/>
                        <YAxis dataKey="3" domain={[0, 'dataMax']} scale='linear' />
                        <Tooltip/>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="3" name="cases" stroke="#ff7300" yAxisId={0}/>
                        <Line type="monotone" dataKey="4" name="deaths" stroke="#ff3300" yAxisId={0}/>
                        <Legend />
                    </LineChart>
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
