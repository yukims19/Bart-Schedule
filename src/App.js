import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class Schedule extends Component {
  render() {
    return (
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>line</th>
            <th>origtime</th>
            <th>desttime</th>
            <th>train head station</th>
            <th>trainid</th>
          </tr>
        </thead>
        <tbody>
          {this.props.schedule.map(obj => {
            return (
              <tr>
                <td>{obj["@line"]}</td>
                <td>{obj["@origTime"]}</td>
                <td>{obj["@destTime"]}</td>
                <td>{obj["@trainHeadStation"]}</td>
                <td>{obj["@trainId"]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

class Station extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      selectedStation: null,
      schedules: []
    };
  }

  componentDidMount() {
    this.ScheduleList();
    this.StationList();
  }

  ScheduleList() {
    if (this.state.selectedStation === null) {
      return;
    }
    var url =
      "http://api.bart.gov/api/sched.aspx?cmd=stnsched&orig=" +
      this.state.selectedStation +
      "&key=MW9S-E7SL-26DU-VV8V&l=1&json=y";
    fetch(url)
      .then(results => results.json())
      .then(data => {
        this.setState({ schedules: data.root.station.item });
      });
  }

  StationList() {
    fetch(
      "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y"
    )
      .then(results => results.json())
      .then(data => {
        console.log(data.root.stations.station);
        this.setState({ stations: data.root.stations.station });
      });
  }

  handleChange() {
    var selected = document.getElementsByTagName("select")[0].value;
    this.setState(
      {
        selectedStation: selected
      },
      () => {
        this.ScheduleList();
      }
    );
  }

  render() {
    return (
      <div>
        <select
          className="form-control"
          onChange={this.handleChange.bind(this)}
        >
          <option value="" selected>
            select a station
          </option>
          {this.state.stations.map(obj => {
            return <option value={obj["abbr"]}>{obj["name"]}</option>;
          })}
        </select>
        <Schedule schedule={this.state.schedules} />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Enter a Bart station name to see the schedule</h1>
        <Station onChange={() => this.handleChange} />
      </div>
    );
  }
}

export default App;
