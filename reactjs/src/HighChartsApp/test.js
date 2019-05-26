import React from 'react';
import axios from 'axios';
import sinon from 'sinon';
import { properties } from '../properties.js';
import { mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import HighChartsApp from './';

configure({ adapter: new Adapter() });

describe('HighChartsApp', () => {
  const result = {
    data: {
      series: [{
        data: [
          {country: 'Afghanistan', category: 'GDP', title: 'Afghanistan GDP'},
          {country: 'Albania', category: 'GDP', title: 'Albania GDP'},
        ]
      }],
    }
  };

  const promise = Promise.resolve(result);

  beforeAll(() => {
    sinon
      .stub(axios, 'get')
      .withArgs(properties.apiUrl)
      .returns(promise);
  });

  afterAll(() => {
    axios.get.restore();
  });

  it('stores data in local state', (done) => {
    const wrapper = mount(<HighChartsApp />);

    expect(wrapper.state().series).toEqual([]);

    promise.then(() => {
      wrapper.update();

      expect(wrapper.state().series.data).toEqual(result.data.series.data);

      done();
    });
  });

  it('renders data when it fetched data successfully', (done) => {
    const wrapper = mount(<HighChartsApp />);

    expect(wrapper.find('p').text()).toEqual(properties.loadingLabel);

    promise.then(() => {
      wrapper.update();

      expect(wrapper.find('div')).toHaveLength(1);

      done();
    });
  });
});