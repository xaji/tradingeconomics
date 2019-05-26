import React, { Component } from 'react';
import axios from 'axios';
import { properties } from '../properties.js';

const ReactHighcharts = require('react-highcharts');

class HighChartsApp extends Component {
  constructor(props) {
    super(props);

    this.apiKey = properties.apiKey;
    this.apiUrl = properties.apiUrl;
    this.chartTitle = properties.chartTitle;
    this.loadingLabel = properties.loadingLabel;

    this.state = {
      series: [],
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    let config = {'Authorization': this.apiKey};
    axios.get(this.apiUrl, {headers: config})
      .then(result => this.iterateResponse(result.data))
      .catch(error => this.setState({
        error,
        isLoading: false
      }));
  }

  //Iterate response, to set LatestValue and Title attributes on the state.
  iterateResponse(data) {
    var series = new Array();
    var countries = new Array();
    Object.keys(data).forEach(function (key){
      var obj = data[key];
      series.push(obj.LatestValue);
      countries.push(obj.Title);
    });
    this.setApiValues(countries, series);
  }
  
  setApiValues(countries, series) {
    this.setState({
      title: {
        text: this.chartTitle
      },
      xAxis: {
        categories: countries
      },
      series: [{
        data: series
      }],
      isLoading: false
    });	
  }

  render() {
    const { error, isLoading } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>{this.loadingLabel}</p>;
    }

    return <ReactHighcharts config={this.state}/>
  }
}

export default HighChartsApp;