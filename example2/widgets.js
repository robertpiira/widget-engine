'use strict';

$we.register('qsFruits', ['/example2/bower_components/underscore/underscore.js', '/example2/bower_components/jquery/dist/jquery.min.js', '/example2/css/banana.css'], function () {

  var templateUrl = '/example2/templates/fruits.tpl';
  var widgets = document.querySelectorAll('[data-widget-type="fruitget"]');

  var FruitWidget = function FruitWidget(el) {

    this.el = el;
    this.$el = $(this.el);

    this.initialize = function () {

      this.events();
      this.render();

    };

    this.events = function () {

      this.$el.on('click', '.js-reco-btn', $.proxy(this.pickFood, this));
      this.$el.on('click', '.js-btn', $.proxy(this.shuffleAndRender, this));

    };

    this.render = function () {

      var _this = this;
      var markup;

      $we.loadFile(this.$el.attr('data-widget-data-src'), function(data) {

        _this.data = JSON.parse(data);

        $we.loadFile(templateUrl, function(template) {

          _this.$el.html(template);

          markup = _this.$el.find('#header-tpl').html();
          _this.$el.find('#header').html(_.template(markup, { title: _this.$el.attr('data-widget-title') } ));

        });

      });

    };

    this.shuffleAndRender= function () {

      var shuffledData = _.shuffle(this.data);
      var markup = this.$el.find('#foods-tpl').html();

      this.$el.find('#foods').html(_.template(markup, { foods: shuffledData } ));

    };

    this.pickFood = function () {

        var favoIndex = _.random(0, this.data.length - 1);
        var favoFood = this.data[favoIndex];

        alert('the pick is: ' + favoFood);

    };

    this.initialize();

  };


  _.each(widgets, function (widget) {

    new FruitWidget(widget);

  });





});
