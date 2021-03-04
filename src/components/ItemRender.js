import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

export default class ItemRender extends Component {
  render() {
    return (
      <TouchableOpacity
        key={this.props.item.node.image.uri}
        onPress={() => {
          this.props.selectItem(this.props.item, this.props.index);
        }}>
        <View style={this.props.item.selected ? this.props.style : {}}>
          <Image
            source={{ uri: this.props.item.node.image.uri }}
            resizeMode="cover"
            style={this.props.itemStyle}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
