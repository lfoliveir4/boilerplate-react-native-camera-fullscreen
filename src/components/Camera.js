import React, { Component } from 'react';
import {
  View,
  Platform,
  PermissionsAndroid,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import ItemRender from './ItemRender';
import { RNCamera } from 'react-native-camera';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

async function requestStoragePermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Acesso ao seu armazenamento de arquivos',
          message:
            'O app precisa de autorização para baixar e armazenar arquivos offline',
          buttonNeutral: 'Ver depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    }
  } catch (err) {
    console.log('permissions errors => ', err);
  }
}

export default class Camera extends Component {
  constructor(props) {
    super(props);

    this.styles = {
      containerStyle: props.containerStyle || {},
      cameraStyle: props.cameraStyle || {
        width: deviceWidth,
        height: deviceHeight,
      },
    };
  }

  render() {
    return (
      <View>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={this.styles.cameraStyle}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={(response) => {
            console.log(response);
          }}
          type={this.props.type}
        />
      </View>
    );
  }
}

export class CameraVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recording: false,
      cameraType: props.cameraType || RNCamera.Constants.Type.back,
    };

    this.styles = {
      containerStyle: props.containerStyle || {},
      cameraStyle: props.cameraStyle || {
        width: deviceWidth,
        height: deviceHeight,
      },
    };

    this.options = {
      quality: props.quality,
      orientation: props.orientation || 'portrait',
      maxDuration: props.maxDuration || 0,
    };
  }

  toggleCamera() {
    if (this.state.cameraType === RNCamera.Constants.Type.back) {
      this.setState({ cameraType: RNCamera.Constants.Type.front });
    } else {
      this.setState({ cameraType: RNCamera.Constants.Type.back });
    }
  }

  render() {
    return (
      <View style={this.styles.containerStyle}>
        <Camera
          ref={(ref) => {
            this.ref = ref;
          }}
          cameraStyle={this.styles.cameraStyle}
          type={this.state.cameraType}
        />
        {!this.props.hideButtons && (
          <View style={{ position: 'absolute', right: 20, top: 20 }}>
            <TouchableOpacity
              onPress={() => this.toggleCamera()}
              style={{
                marginRight: 30,
                marginTop: Platform.OS === 'ios' ? 40 : 0,
              }}>
              {/* <Icon
                type="ionicon"
                name="md-reverse-camera"
                color="#E1E7EF"
                size={35}
              /> */}
            </TouchableOpacity>
          </View>
        )}
        {!this.props.hideButtons && (
          <View
            style={{
              position: 'absolute',
              bottom: 50,
              left: deviceWidth / 2 - 50,
            }}>
            <TouchableOpacity onPress={() => this.recordVideo()}>
              <View
                style={{
                  borderColor: 'rgba(200, 200, 200, 0.5)',
                  borderRadius: 50,
                  borderWidth: 5,
                  height: 100,
                  width: 100,
                  paddingTop: this.state.recording ? 20 : 10,
                  paddingLeft: this.state.recording ? 20 : 10,
                }}>
                <View
                  style={{
                    backgroundColor: this.state.recording
                      ? 'rgba(255,0,0,0.5)'
                      : 'rgba(200, 200, 200, 0.5)',
                    borderRadius: this.state.recording ? 5 : 35,
                    height: this.state.recording ? 50 : 70,
                    width: this.state.recording ? 50 : 70,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  async recordVideo() {
    if (this.state.recording) {
      this.setState({ recording: false });
      this.ref.camera.stopRecording();
      if (this.props.onStopRecording) this.props.onStopRecording();
    } else {
      this.setState({ recording: true });
      if (this.props.onStartRecording) this.props.onStartRecording();
      const { options } = this;
      const data = await this.ref.camera.recordAsync(options);
      if (this.props.getVideo) this.props.getVideo(data);
    }
  }
}

class HiGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      galleryType: props.galleryType || 'Photos',
      group: props.group || 'All',
      title: props.title,
      perPage: props.perPage || 99999,
      columns: props.columns || 4,
      maxSelect: props.maxSelect || 1,
      photos: [],
      selectedItems: [],
      filterBy: props.filterBy,
      maxSelect: props.maxSelect || 1,
      overwriteSelected: props.overwriteSelected || false,
      indexLoaded: 0,
    };

    this.albums = [];

    this.events = {};

    this.styles = {
      itemStyle: this.props.itemStyle || {
        width: deviceWidth / this.state.columns,
        height: 200,
      },
      selectedStyle: this.props.selectedStyle || { opacity: 0.5 },
      titleStyle: this.props.titleStyle,
      containerStyle: this.props.containerStyle,
    };
  }

  async componentDidMount() {
    await requestStoragePermission();
    await this.renderPhotos();
    this._getAlbums();
  }

  async renderPhotos() {
    this.setState({ selectedItems: [] });
    let photos = await CameraRoll.getPhotos({
      first: this.state.perPage,
      assetType: this.state.galleryType,
      groupName: this.state.filterBy,
    }).then((r) => r);
    await this.setState({
      after: photos.page_info.end_cursor,
      photos: photos.edges,
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.filterBy !== state.filterBy) {
      return { filterBy: props.filterBy };
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.renderPhotos();
  }

  _getMore = async () => {
    console.log('more...');
    let photos = await CameraRoll.getPhotos({
      first: this.state.perPage,
      after: this.state.after,
      assetType: this.state.galleryType,
    }).then((r) => r);
    await this.setState({
      after: photos.page_info.end_cursor,
      photos: this.state.photos.concat(photos.edges),
    });
  };

  _getAlbums() {
    this.albums = this.state.albums;
    let albums = [];
    this.state.photos.map((photo) => {
      if (albums.indexOf(photo.node.group_name) < 0)
        albums.push(photo.node.group_name);
    });
    if (this.props.getAlbums) this.props.getAlbums(albums);
  }

  _selectItem = async (item, index) => {
    let { photos, selectedItems } = this.state;
    if (item.selected) {
      photos[index].selected = false;
      selectedItems = selectedItems.filter((select) => select !== item);
    } else {
      if (this.state.maxSelect > selectedItems.length) {
        photos[index].selected = true;
        selectedItems = selectedItems.concat(item);
      } else if (
        this.state.maxSelect == selectedItems.length &&
        this.state.overwriteSelected
      ) {
        itemRemoved = selectedItems.shift();
        photos = photos.map((photo) => {
          if (photo.node === itemRemoved.node) {
            photo.selected = false;
            return photo;
          } else {
            return photo;
          }
        });
        photos[index].selected = true;
        selectedItems = selectedItems.concat(item);
      }
    }
    await this.setState({ photos, selectedItems });
    if (this.props.selectedItems) this.props.selectedItems(selectedItems);
  };

  unselectAll() {
    selectedItems = [];
    photos = this.state.photos.map((photo) => {
      photo.selected = false;
      return photo;
    });
    this.setState({ selectedItems, photos });
  }

  _renderItem = ({ item, index }) => {
    return (
      <ItemRender
        item={item}
        index={index}
        selectItem={this._selectItem}
        style={this.styles.selectedStyle}
        itemStyle={this.styles.itemStyle}
      />
    );
  };

  _keyExtractor = (item) => item.node.image.uri;

  render() {
    return (
      <FlatList
        extraData={this.state}
        data={this.state.photos}
        numColumns={this.state.columns}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        onEndReached={this._getMore}
        onEndReachedThreshold={0.1}
      />
    );
  }
}

export { HiGallery as Gallery };
