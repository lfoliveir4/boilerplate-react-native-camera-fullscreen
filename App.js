import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { CameraVideo } from './src/components/Camera';

const DeviceWidth = Dimensions.get('window').width;
const DeviceHeight = Dimensions.get('window').height;

class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: '',
      loading: false,
    };
  }

  renderButtonClass() {
    let middle = DeviceHeight / 2 + 10;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.toggleDrawer();
          }}
          style={{
            backgroundColor: '#121',
            width: 88,
            height: 72,
            position: 'absolute',
            top: this.state.fullscreen ? middle + middle / 3 : middle,
            right: 0,
            zIndex: 9,
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderColor: '#321',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* <Icon
              name="md-football"
              type="ionicon"
              color={primaryColor}
              size={32}
            /> */}
            <Text
              style={{
                color: '#123',
                fontSize: 9,
                marginRight: 0,
                marginLeft: 0,
                textAlign: 'center',
              }}>
              VOLTAR
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _getVideo = (video) => {
    this.setState({ video });
    this.props.navigation.navigate('previewVideo', {
      video: video,
      postVideo: this.postVideo,
    });
  };

  render() {
    return (
      <View
        style={{
          width: DeviceWidth,
          height: DeviceHeight,
          flex: 1,
          position: 'relative',
        }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1,
          }}>
          <CameraVideo
            maxDuration={60}
            getVideo={this._getVideo}
            cameraStyle={{
              width: DeviceWidth,
              height: DeviceHeight,
              overflow: 'hidden',
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            zIndex: 999,
            bottom: 50,
            left: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('postGallery', {
                postVideo: this.postVideo,
              });
            }}>
            {/* <Icon
              type="ionicon"
              name="ios-images"
              color={borderPrimary}
              size={40}
            /> */}
          </TouchableOpacity>
        </View>
        {this.renderButtonClass()}
      </View>
    );
  }
}

export default CameraScreen;
