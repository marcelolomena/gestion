/**
 {
    statusCode: 200,
    data: {
        shows: [
            {
                "name": "On The Town",
                "description": "Best show ever",
                "numberOfTickets": 5
            },
            {
                "name": "Phantom of the Opera",
                "description": "a really old show",
                "numberOfTickets": 3
            }
        ]
    }
}
 */

var ShowListManager = function(container) {
    this.htmlContainer = container; // should be dom element
    this.$htmlContainer = $(this.htmlContainer);

    this.shows = [];
    this.errorMsg = 'No shows available';

    this.getShowsConfig('/shows');

};

/**
    getShowsConfig makes an ajax GET request for a JSON object containing an array of single show objects.
    On success, sets this.shows to array containing single show JSON objects
    On error, sets new error message
    @endpoint: string, url to request
*/
ShowListManager.prototype.getShowsConfig = function(endpoint) {
    var _this = this;

    $.ajax(endpoint, {
        type: 'GET',
        complete: function(response) {
            _this.shows = $.parseJSON(response).data.shows;
            _this.updateView();
        },
        error: function(error) {
            _this.errorMsg = 'There was an error!';
            _this.displayErrors();
        }
    });

};

ShowListManager.prototype.updateView = function() {
    var _this = this;

    // empty html container
    this.$htmlContainer.empty();

    // parse shows array and update markup
    this.shows.forEach(function(show, i) {
        var showEl = _this.createShowListItem(show);

        this.$htmlContainer.append(showEl);
    });

};

ShowListManager.prototype.displayErrors = function() {
    // replace show markup with error message
    this.$htmlContainer.html(this.errorMsg);
};

ShowListManager.prototype.createShowListItem = function(show) {
    return $('<li><h2>' + show.name + '<h2><p>' + show.description + '</p><p>Number of Tickets: ' + show.numberOfTickets + '</p></li>');
};
