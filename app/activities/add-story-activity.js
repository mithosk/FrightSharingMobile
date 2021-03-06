'use strict';

import { style } from '../style';
import I18n from 'react-native-i18n';
import { localize } from '../position';
import React, { Component } from 'react';
import { translate } from '../vocabulary';
import { View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon, Button, Input } from 'react-native-elements';
import storyRepository from '../repositories/story-repository';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AddStoryActivity extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: "",
      titleErr: "",
      tale: "",
      taleErr: "",
      loader: false
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ marginTop: 30 }}>
          <Input placeholder={translate("addstory_body_title")} errorMessage={this.state.titleErr} errorStyle={style.ErrorLabel} maxLength={42} onChangeText={text => this.setState({ title: text })} />
          <Input placeholder={translate("addstory_body_tale")} errorMessage={this.state.taleErr} errorStyle={style.ErrorLabel} multiline={true} onChangeText={text => this.setState({ tale: text })} />
        </ScrollView>
        <View>
          <Button buttonStyle={style.ButtonDark} icon={<Icon type="feather" name="share" size={40} />} title={translate("addstory_footer_publish")} titleStyle={style.ButtonTitle} onPress={this.publish} />
        </View>
        {
          this.state.loader ?
            <View style={style.LoaderOverlay}>
              <ActivityIndicator size={style.Loader.width} color={style.Loader.color} />
            </View>
            : null
        }
      </View>
    );
  }

  publish = async () => {
    var validTitle = this.state.title.length > 0;
    var validTale = this.state.tale.length > 0;

    this.setState({
      titleErr: !validTitle ? translate("addstory_body_titleerr") : "",
      taleErr: !validTale ? translate("addstory_body_taleerr") : ""
    });

    if (validTitle & validTale) {
      this.setState({ loader: true });

      try {
        var location = await localize();

        var story = new Object();
        story.language = I18n.currentLocale();
        story.title = this.state.title;
        story.tale = this.state.tale;
        story.latitude = location.latitude;
        story.longitude = location.longitude;
        story.userId = await AsyncStorage.getItem("userId");

        await storyRepository.post(story);

        this.props.navigation.navigate("home", { searchModal: false, searchMode: "mine" });
      }
      catch (e) {
        this.setState({ loader: false });
        alert(e);
      }
    }
  }

}