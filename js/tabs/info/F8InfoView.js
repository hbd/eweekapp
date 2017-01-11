/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @providesModule F8InfoView
 * @flow
 */
'use strict';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  AppRegistry,
  Text,
  NavigatorIOS,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
  StyleSheet
} from 'react-native';

var CommonQuestions = require('./CommonQuestions');
var LinksList = require('./LinksList');
var ListContainer = require('ListContainer');
var PureListView = require('../../common/PureListView');
var React = require('React');
var Relay = require('react-relay');
var View = require('View');
var WiFiDetails = require('./WiFiDetails');


const POLICIES_LINKS = [{
  title: 'Terms of Service',
  url: 'https://m.facebook.com/terms?_rdr',
}, {
  title: 'Data Policy',
  url: 'https://m.facebook.com/policies?_rdr',
}, {
  title: 'Code of Conduct',
  url: 'https://www.fbf8.com/code-of-conduct',
}];

class F8InfoView extends React.Component {
  onSuccess(e) {
    Linking.openURL(e.data).catch(err => console.error('An error occured', err))
    console.log(e)
  }

  render() {
    return (
      <NavigatorIOS
	initialRoute={{
          component: QRCodeScanner,
          title: 'Scan Code',
          passProps: {
            onRead: this.onSuccess.bind(this),
            topContent:
	      <Text style={styles.centerText}>
		  Go to
		    <Text style={styles.textBold}>
			wikipedia.org/wiki/QR_code
		      </Text> on your computer and scan the QR code.
		</Text>,
          }
	}}
      style={{flex: 1}}
	/>
    );
  }
}

function InfoList({viewer: {config, faqs, pages}, ...props}) {
  return (
    <PureListView
      renderEmptyList={() => (
        <View>
          <WiFiDetails
            network={config.wifiNetwork}
            password={config.wifiPassword}
          />
          <CommonQuestions faqs={faqs} />
          <LinksList title="Facebook pages" links={pages} />
          <LinksList title="Facebook policies" links={POLICIES_LINKS} />
        </View>
      )}
      {...(props: any /* flow can't guarantee the shape of props */)}
    />
  );
}


var styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    borderRadius: 3,
    padding: 32,
    width: 100,
    marginTop: 64,
    marginBottom: 64,
  },

  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },

  textBold: {
    fontWeight: '500',
    color: '#000',
  },

  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },

  buttonTouchable: {
    padding: 16,
  }
});

InfoList = Relay.createContainer(InfoList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        config {
          wifiNetwork
          wifiPassword
        }
        faqs {
          question
          answer
        }
        pages {
          title
          url
          logo
        }
      }
    `,
  },
});

module.exports = F8InfoView;

/*


      <ListContainer
    title="Information"
    backgroundImage={require('./img/info-background.png')}
    backgroundColor={'#47BFBF'}>
      <InfoList />
      </ListContainer>


*/
