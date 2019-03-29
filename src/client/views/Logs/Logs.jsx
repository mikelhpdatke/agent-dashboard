import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Chartist from "chartist";
import MUIDataTable from "mui-datatables";
import { Grid, Chip } from "@material-ui/core";
import { md5HashArr, IPArr, FileArr, CMDLineArr } from '../../variables/random';

let tickers = ["12am", "3pm", "6pm", "9pm", "12pm", "3am", "6am", "9am"];

const _completedTasksChart = {
  data: {
    labels: [],
    series: [[]],
  },
  options: {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0,
    }),
    low: 0,
    high: 1000, 
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
};

const Md5Columns = ["IP", "File", "Timestamp", "MD5"];

const _Md5Data = [
 ["192.168.1.2", "Data.txt", (new Date()).toLocaleDateString(), "12e1e3e4c94353c91ed7e71ce872533e"],
];

const PIDColumns = ["IP", "Timestamp", 
  {
    name: "PID List",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
        return <div>{value.map((v, index) => <Chip style={{margin: '5px'}} label={v} key={index} />)}</div>
      }
    },
  }];

const _PIDData = [
 ["192.168.1.2", (new Date()).toLocaleDateString(), ["1245", "4556", "2588"]],
];

const SyscallColumns = ["IP", "Timestamp", "PID", "CMD Line", "Syscall"];

const _SyscallData = [
 ["192.168.1.2", (new Date()).toLocaleDateString(), "4425", "ls -al", "3"],
];

const options = {
  download: false,
  print: false,
  viewColumns: false,
  selectableRows: false,
  sort: false,
  rowsPerPage: 5,
  rowsPerPageOptions: [5, 10, 20],
};

class Logs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      completedTasksChart: _completedTasksChart,
      Md5Data: _Md5Data,
      PIDData: _PIDData,
      SyscallData: _SyscallData,
    }
    this.updateChartData = this.updateChartData.bind(this);
    this.updateMd5Data = this.updateMd5Data.bind(this);
    this.updatePIDData = this.updatePIDData.bind(this);
    this.updateSyscallData = this.updateSyscallData.bind(this);
  }

  updateChartData() {
    const { completedTasksChart } = this.state;
    const { labels, series } = this.state.completedTasksChart.data;
    let newLabels = [...labels, tickers[0]];
    let newSeries = [
      [...series[0], Math.floor(Math.random() * 800) + 1],
    ];
    tickers = [...tickers.slice(1), tickers[0]];
    if (newLabels.length >= 20) {
      newLabels = newLabels.slice(1)
      newSeries = [
        newSeries[0].slice(1),
      ]
    }
    this.setState({
      completedTasksChart: {
        ...completedTasksChart,
        data: {
          labels: newLabels,
          series: newSeries,
        }
      }
    })
  }

  updateMd5Data() {
    const { Md5Data } = this.state;
    const randData = [
      IPArr[Math.floor(Math.random() * IPArr.length)],
      FileArr[Math.floor(Math.random() * FileArr.length)],
      (new Date()).toLocaleDateString(),
      md5HashArr[Math.floor(Math.random() * md5HashArr.length)],
    ]
    const newMd5Data = [randData, ...Md5Data]
    this.setState({
      Md5Data: newMd5Data,
    })
  }

  updatePIDData() {
    const { PIDData } = this.state;
    const randData = [
      IPArr[Math.floor(Math.random() * IPArr.length)],
      (new Date()).toLocaleDateString(),
      Array.from({length: Math.floor(Math.random() * 4) + 1})
        .map(_ => {
          return Math.floor(Math.random() * 10000)
        }),
    ]
    const newPIDData = [randData, ...PIDData]
    this.setState({
      PIDData: newPIDData,
    })
  }

  updateSyscallData() {
    const { SyscallData } = this.state;
    const randData = [
      IPArr[Math.floor(Math.random() * IPArr.length)],
      (new Date()).toLocaleDateString(),
      Math.floor(Math.random() * 10000),
      CMDLineArr[Math.floor(Math.random() * CMDLineArr.length)],
      Math.floor(Math.random() * 338),
    ]
    const newSyscallData = [randData, ...SyscallData]
    this.setState({
      SyscallData: newSyscallData,
    })
  }


  componentDidMount() {
    this.updateChartData();
    this.updateMd5Data();
    this.updatePIDData();
    this.updateSyscallData();
    this.chartInterval = setInterval(this.updateChartData, 1000);
    this.md5Interval = setInterval(this.updateMd5Data, 1000);
    this.pidInterval = setInterval(this.updatePIDData, 1000);
    this.syscallInterval = setInterval(this.updateSyscallData, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.chartInterval);
    clearInterval(this.md5Interval);
    clearInterval(this.pidInterval);
    clearInterval(this.syscallInterval);
  }

  render() {

    const { completedTasksChart, Md5Data, PIDData, SyscallData } = this.state;

    return (
      <Card chart>
        <CardHeader color="success">
          <ChartistGraph
            className="ct-chart"
            data={completedTasksChart.data}
            type="Line"
            options={completedTasksChart.options}
          />
        </CardHeader>
        <CardBody>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <MUIDataTable
                title={"MD5 Logs"}
                data={Md5Data}
                columns={Md5Columns}
                options={options}
              />
            </Grid>
            <Grid item xs={12}>
              <MUIDataTable
                title={"PID Logs"}
                data={PIDData}
                columns={PIDColumns}
                options={options}
              />
            </Grid>
            <Grid item xs={12}>
              <MUIDataTable
                title={"Syscall Logs"}
                data={SyscallData}
                columns={SyscallColumns}
                options={options}
              />
            </Grid>
          </Grid>
        </CardBody>
      </Card>
    );
  }
}

export default Logs;
