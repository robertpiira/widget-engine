'use strict';

$we.register('qsFruits', ['bower_components/underscore/underscore.js', 'bower_components/jquery/dist/jquery.min.js', 'css/banana.css'], function () {

  var templateUrl = 'templates/fruits.tpl';
  var widgets = document.querySelectorAll('[data-widget-type="fruitget"]');

  var fruitView = $we.View({

    initialize: function () {

      this.events();
      this.render();

    },

    events: function () {

      this.$el.on('click', '.js-reco-btn', $.proxy(this.pickFood, this));
      this.$el.on('click', '.js-btn', $.proxy(this.shuffleAndRender, this));

    },

    render: function () {

      var _this = this;
      var markup;

      $we.loadFile(this.$el.attr('data-widget-data-src'), function(data) {

        _this.data = JSON.parse(data);

        $we.loadFile(templateUrl, function(template) {

          _this.$el.html(template);

          markup = _this.$('#header-tpl').html();
          _this.$('#header').html(_.template(markup, { title: _this.$el.attr('data-widget-title') } ));

        });

      });



    },

    shuffleAndRender: function () {

      var shuffledData = _.shuffle(this.data);
      var markup = $('#foods-tpl').html();

      this.$('#foods').html(_.template(markup, { foods: shuffledData } ));

    },

    pickFood: function () {

        var favoIndex = _.random(0, this.data.length - 1);
        var favoFood = this.data[favoIndex];

        alert('the pick is: ' + favoFood);

    }

  });


  _.each(widgets, function (widget) {

    fruitView.bootstrap({ el: widget });

  });





});
