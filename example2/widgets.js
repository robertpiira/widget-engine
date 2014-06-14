'use strict';

$we.register('qsFruits', ['bower_components/underscore/underscore.js', 'bower_components/jquery/dist/jquery.min.js', 'css/banana.css'], function () {

  var templateUrl = 'templates/fruits.tpl';
  var fruitData = ['banan', 'citron', 'melon', 'mango'];

  var widgetView = $we.View({

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

      $we.loadFile(templateUrl, function(template) {

        _this.$el.html(template);

        markup = _this.$('#header-tpl').html();
        _this.$('#header').html(_.template(markup, { title: _this.$el.attr('data-widget-title') } ));

      });

    },

    shuffleAndRender: function () {

      var shuffledData = _.shuffle(fruitData);
      var markup = $('#foods-tpl').html();

      this.$('#foods').html(_.template(markup, { foods: shuffledData } ));

    },

    pickFood: function () {

        var favoIndex = _.random(0, fruitData.length - 1);
        var favoFood = fruitData[favoIndex];

        alert('the pick is: ' + favoFood);

    }

  });


  $(function () {

    var wiidget = widgetView.bootstrap({ el: document.getElementById( $we.name ) });

    console.log(wiidget)

  });


});
