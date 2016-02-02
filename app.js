var Twit = require('twit');
var async = require('async');
var request = require('request');
var Appbase = require('appbase-js');
var requestUrl = 'https://medium.com/@shahyash/follow-list?listType=followers&page=0';
var mediumAccessToken = '28a3095eb492b393e51092223f51b75222bc6146fd9cb08cd35e5c89fad4d3556';
var twitterAccessToken = '2311820418-XSsBD3Ne6zSVl6F5uXWiiDK3pEhu8Fz7XkXOXfq';
var twitterAccessToken_secret = 'ozRipDcytwepoLtEC5FMe154Ix76zJNo2wyeyVsGMo9hg';
var twitterConsumer_key = 'DPjfGKsisymDnWV69thx2FhXI';
var twitterConsumer_secret = 'Dy9sjEwforlZdiVmSYBs9MOyXeLYfJMwVj68AuDaszPzWQfJcG';

var appbaseRef = new Appbase({
    url: 'https://scalr.api.appbase.io',
    appname: 'medium-to-twitter',
    username: 'NZ5hisiMX',
    password: '29dff771-5de3-4c9c-9df8-70d350faa3a4'
});
var makeRequest = function(URL, callback) {
    // console.log("Inside")
    request({
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + this.mediumAccessToken,
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        url: URL
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var jsonResponse;
            try {
                jsonResponse = JSON.parse(body.substr(body.indexOf('{'), body.lastIndexOf('}')));
            } catch (e) {
                callback(e);
            }
            if (!!jsonResponse.payload && !!jsonResponse.payload.value) {

                followers = jsonResponse.payload.value.map(function(follower) {
                    if (follower.twitterScreenName === '') {
                        return;
                    }
                    return follower.twitterScreenName;
                });
                saveToDatabase(followers)
            } else {
                callback({
                    'error': 'no followers'
                });
            }
        } else {
            callback({
                'error': error,
                'statusCode': response.statusCode,
                'response': response
            });
        }
    });
};
var saveToDatabase = function(follower) {
    followers.map(function(object) {
        if (object) {
            var jsonObject = {
                twitterHandle: object
            }
            appbaseRef.index({
                type: 'followers',
                id: object,
                body: jsonObject
            }).on('data', function(response) {
                if (response.created) {
                    console.log(object);
                    sendTweetToFollower(object)
                }
            }).on('error', function(error) {
                console.log(error);
            });
        }

    })
};
var sendTweetToFollower = function(twitterUsername) {
    var T = new Twit({
        consumer_key: this.twitterConsumer_key,
        consumer_secret: this.twitterConsumer_secret,
        access_token: this.twitterAccessToken,
        access_token_secret: this.twitterAccessToken_secret
    });

    T.post('statuses/update', {
        status: '@' + twitterUsername + ' Gracias por seguirme en Medium, un abrazo!'
    }, function(err) {
        if (err) {
            callback(err);
        }

    });

};

makeRequest(requestUrl)