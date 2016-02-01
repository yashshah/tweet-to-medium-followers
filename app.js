var Twit = require('twit');
var async = require('async');
var request = require('request');
var requestUrl = 'https://medium.com/@shahyash/follow-list?listType=followers&page=';
var mediumAccessToken = '28a3095eb492b393e51092223f51b75222bc6146fd9cb08cd35e5c89fad4d3556';
var twitterAccessToken = '2311820418-XSsBD3Ne6zSVl6F5uXWiiDK3pEhu8Fz7XkXOXfq';
var twitterAccessToken_secret = 'ozRipDcytwepoLtEC5FMe154Ix76zJNo2wyeyVsGMo9hg';
var twitterConsumer_key = 'DPjfGKsisymDnWV69thx2FhXI';
var twitterConsumer_secret = 'Dy9sjEwforlZdiVmSYBs9MOyXeLYfJMwVj68AuDaszPzWQfJcG';
var pageCount = 0;
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
                if (followers.length > 0) {
                    console.log(followers)
                    pageCount = pageCount + 1
                    makeRequest(requestUrl + pageCount)
                    console.log(requestUrl + pageCount)
                }
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
var saveToDatabase = function(followers, callback) {

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

makeRequest(requestUrl + pageCount, function(error, followers) {
    if (error) {
        done(error);
    } else {
        console.log("Make Request")
            // this.saveToDatabase(followers, function(err) {
            //     if (err) {
            //         done(error);
            //     }
            //     this.sendTweetToFollower(function(err) {
            //         if (err) {
            //             done(error);
            //         }
            //         done(null, 'OK');
            //     });
            // });
    }
});