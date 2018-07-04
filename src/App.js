import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredSchedule: []
    };
  }

  handleChange() {
    var head = document.getElementById("head-options").value;
    const filteredSchedule = this.props.value
      .filter(obj => obj["@trainHeadStation"] == head)
      .map(obj => (
        <tr>
          <td>{obj["@line"]}</td>
          <td>{obj["@origTime"]}</td>
          <td>{obj["@trainHeadStation"]}</td>
        </tr>
      ));
    this.setState({
      filteredSchedule: filteredSchedule
    });
  }

  render() {
    var display;
    if (this.state.filteredSchedule.length > 0) {
      display = this.state.filteredSchedule;
    } else {
      display = this.props.value.map(obj => (
        <tr>
          <td>{obj["@line"]}</td>
          <td>{obj["@origTime"]}</td>
          <td>{obj["@trainHeadStation"]}</td>
        </tr>
      ));
    }

    return (
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th>Line</th>
            <th>OrigTime</th>
            <th>
              TrainHeadStation
              <select
                className="form-control"
                id="head-options"
                onChange={this.handleChange.bind(this)}
              >
                <option value="" selected>
                  Filter by HeadStationx
                </option>
                {this.props.options.map(value => {
                  return <option value={value}>{value}</option>;
                })}
              </select>
            </th>
          </tr>
        </thead>
        <tbody>{display}</tbody>
      </table>
    );
  }
}

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stations: [],
      selectedStation: null,
      selectedDate: "today",
      schedules: [],
      headOptions: []
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
      "&date=" +
      this.state.selectedDate +
      "&key=MW9S-E7SL-26DU-VV8V&l=1&json=y";
    fetch(url)
      .then(results => results.json())
      .then(data => {
        this.setState({ schedules: data.root.station.item });
      })
      .then(() => {
        const head = [];
        this.state.schedules.forEach(obj => {
          if (!head.includes(obj["@trainHeadStation"])) {
            head.push(obj["@trainHeadStation"]);
          }
        });
        this.setState({ headOptions: head });
      });
  }

  StationList() {
    fetch(
      "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y"
    )
      .then(results => results.json())
      .then(data => {
        this.setState({ stations: data.root.stations.station });
      });
  }

  handleChange() {
    var selectedStation = document.getElementsByTagName("select")[0].value;
    var date;
    if (!document.getElementById("date-input").value) {
      date = "today";
    } else {
      var selectedDate = document.getElementById("date-input").value.split("-");
      date = selectedDate[1] + "/" + selectedDate[2] + "/" + selectedDate[0];
    }

    this.setState(
      {
        selectedStation: selectedStation,
        selectedDate: date
      },
      () => {
        this.ScheduleList();
      }
    );
  }

  render() {
    if (this.state.selectedStation) {
      var title = (
        <h4>
          Schedule of {this.state.selectedStation} for {this.state.selectedDate}
        </h4>
      );
    }
    return (
      <div>
        <select
          className="form-control"
          onChange={this.handleChange.bind(this)}
          id="stationName"
        >
          <option value="" selected>
            select a station
          </option>
          {this.state.stations.map(obj => {
            return <option value={obj["abbr"]}>{obj["name"]}</option>;
          })}
        </select>
        <input
          class="form-control"
          type="date"
          id="date-input"
          onChange={this.handleChange.bind(this)}
        />
        {title}
        <Table value={this.state.schedules} options={this.state.headOptions} />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Enter information to see Bart station schedule</h1>
        <Schedule onChange={() => this.handleChange} />
      </div>
    );
  }
}

export default App;
