import React, { Component } from 'react';
import Video from '#/modules/video';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import firebase from 'react-native-firebase';
import { Icon } from 'react-native-elements';
import Orientation from 'react-native-orientation-locker';
import LoadingComponent from '../components/LoadingComponent';

import Styles, { primaryColor, DeviceHeight, btnColor } from '../Styles';
const { style } = Styles;

import useTranslation from '../hooks/useTranslation';
const { translate } = useTranslation();

class PreviewVideo extends Component {
  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      participationID: '',
      video: navigation.getParam('video'),
      postVideo: navigation.getParam('postVideo'),
      loading: false,
    };
  }

  renderButtonSend() {
    if (this.state.loading) {
      return (
        <View
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 50,
            zIndex: 99999,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 50,
              overflow: 'hidden',
              backgroundColor: '#FFF',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/loading_buffer.gif')}
              style={{ width: 70, height: 70, borderRadius: 50 }}
              resizeMode={'cover'}
            />
          </View>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({ loading: true });
            this.state.postVideo(this.state.video.uri);
          }}
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 50,
            zIndex: 99,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 50,
              backgroundColor: '#228b22',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              iconStyle={{ height: 45, marginTop: -15 }}
              name="ios-checkmark"
              color="#CCC"
              type={'ionicon'}
              size={60}
            />
            <Text style={{ color: '#CCC' }}>{translate('ENVIAR')}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }
  renderButtonClose() {
    if (!this.state.loading) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('camera');
          }}
          style={{
            position: 'absolute',
            bottom: 60,
            left: 50,
            zIndex: 99999,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: btnColor + '88',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="ios-close"
              color={primaryColor}
              type={'ionicon'}
              size={35}
            />
          </View>
        </TouchableOpacity>
      );
    }
  }

  render() {
    return (
      <View>
        <View style={{ width: '100%', height: '100%' }}>
          <Video
            source={this.state.video}
            resizeMode="cover"
            style={{ width: '100%', height: '100%' }}
            studio="NJR XP"
            shouldPlay
            volume={0}
            repeat
            delay={2000}
            iconPlay={
              <Icon type="ionicon" name="ios-play" color="#FFF" size={60} />
            }
            iconPause={
              <Icon type="ionicon" name="ios-pause" color="#FFF" size={60} />
            }
          />
          {this.renderButtonSend()}
          {this.renderButtonClose()}
        </View>
      </View>
    );
  }
}

export default PreviewVideo;
