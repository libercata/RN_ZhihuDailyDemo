import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  Alert,
  StatusBar,
  ListView,
  RefreshControl,
} from 'react-native';

import SideMenu from 'react-native-side-menu';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Swiper from 'react-native-swiper';

import makeCancelable from './util/Cancelable';
import ChinaNums from './util/Functions';

const GET_HOME_DATA = 'http://news-at.zhihu.com/api/4/news/latest'

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
      isRefreshing: false,
      today: '',

      isOpen: false,
      // stories: null,
      top_stories: null,
    }
    // this.props.today = this.getTodayDate();
    this.getTodayDate = this.getTodayDate.bind(this);
    this.fetchLatestStories = this.fetchLatestStories.bind(this);
  }

  getTodayDate() {
    var dd = new Date();
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期 
    var d = dd.getDate();

    this.setState({
      today: y + '' + m + '' + d,
    })
  }


  componentDidMount() {
    this.fetchLatestStories();
    this.getTodayDate();
  }

  fetchLatestStories() {
    this.setState({ isRefreshing: true })

    this.cancelable = makeCancelable(fetch(GET_HOME_DATA, {
      method: 'GET',
    }));

    this.cancelable.promise
      .then((response) => response.json())
      .then((responseData) => this.receivedLatestData(responseData))
      .catch((error) => {
        console.log(error);
        Alert.alert('错误', error.message);
      });
  }

  receivedLatestData(responseData) {
    var receivedStories = {};
    receivedStories[responseData.date] = responseData.stories;

    this.setState({
      isRefreshing: false,
      top_stories: responseData.top_stories,
      // dataSource: this.state.dataSource.cloneWithRows(responseData.stories),
      dataSource: this.state.dataSource.cloneWithRowsAndSections(receivedStories),
    })
  }

  renderList() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderStory.bind(this)}
        renderSectionHeader={this.renderStorySectionHeader.bind(this)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.fetchLatestStories}
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#ffff00"
            />
        }
        />
    );
  }
  renderStory(story, section, row) {
    // console.log('==========================');
    // console.log(story);
    // console.log(section, row)
    return (
      <View style={[styles.container, { flexDirection: 'row' }]}>
        <Image source={{ uri: story.images[0] }} style={{ width: 80, height: 60 }} />
        <Text style={{ flex: 1 }}> {story.title} </Text>
      </View>
    );
  }

  renderStorySectionHeader(date, section) {

    if (this.state.today == section) {
      sectionTitle = "今日热文";
    } else {
      var date_str = section.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');

      var m = parseInt(section / 100) % 100;
      var d = section % 100;
      var w = new Date(date_str).getDay()
      sectionTitle = m + '月' + d + '日 ' + "星期" + chinanums[w];
    }

    console.log(sectionTitle, section, d, m);


    return (
      <View style={styles.section} >
        <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 15,}}> {sectionTitle} </Text>
      </View>
    );
  }

  render() {
    if (!this.state.stories && !this.state.top_stories) {
      return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text> Loading </Text>
        </View>
      )
    }
    const menu = <LeftMenu />

    return (
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => { this.setState({ isOpen: isOpen }) } }
        openMenuOffset={Dimensions.get('window').width * 0.5}
        >
        <StatusBar barStyle="light-content" />

        <View style={{ flex: 1, backgroundColor: 'aliceblue' }}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            height={180}
            autoplay={true}
            activeDotColor={'white'}
            paginationStyle={{ top: 160 }}
            >
            <Image source={{ uri: this.state.top_stories[0].image }} style={styles.slide1}>
            </Image>
            <Image source={{ uri: this.state.top_stories[1].image }} style={styles.slide2}>
            </Image>
            <Image source={{ uri: this.state.top_stories[2].image }} style={styles.slide3}>
            </Image>
            <Image source={{ uri: this.state.top_stories[3].image }} style={styles.slide3}>
            </Image>
            <Image source={{ uri: this.state.top_stories[4].image }} style={styles.slide3}>
            </Image>
          </Swiper>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54 }}>
            <Text style={styles.titleText}> 今日热文 </Text>
          </View>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => this.onMenuBtnPress()}
            >
            <Icon name='menu' color='white' size={18} style={{ backgroundColor: 'transparent' }} />
          </TouchableOpacity>
          {this.renderList()}
        </View>
      </SideMenu>
    );
  }

  onMenuBtnPress() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
}

// function chinanum(num){  
//     var china = new Array('零','一','二','三','四','五','六','七','八','九');  
//     var arr = new Array();  
//     var english = num.split('')  
//     for(var i=0;i<english.length;i++){  
//         arr[i] = china[english[i]];  
//     }  
//     return arr.join("")  
// }  

class LeftMenu extends Component {

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'steelblue' }} />
    );
  }
};

const chinanums = ChinaNums();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    left: 5,
    top: 15,
    position: 'absolute',
  },
  wrapper: {
    // flex: 1,
    // height: 120,
    // marginTop: 0,
  },
  titleText: {
    color: 'white',
    alignSelf: 'center',
    marginTop: 26,
    fontSize: 17,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  section: { 
    flex: 1,
    backgroundColor: 'skyblue', 
    height: 35, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});